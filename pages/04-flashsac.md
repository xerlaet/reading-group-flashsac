---
section: FlashSAC
layout: default
class: fast-training
---

# 1. Fast Training

<blockquote v-click.fade>

Under a fixed compute budget, larger models and larger batches with fewer updates converge faster than small models updated often

</blockquote>

<div class="h-4"></div>

<div class="fast-grid">
  <div v-click.fade class="accent-card">
    <strong>Massive Parallel Simulation</strong>
    <span>1,024 environments</span>
  </div>
  <div v-click.fade class="accent-card">
    <strong>Large Replay Buffer</strong>
    <span>10M transitions vs. 1M</span>
  </div>
  <div v-click.fade class="accent-card">
    <strong>Larger Model</strong>
    <span>2.5M parameters vs. 0.2-0.5M</span>
    <span>6 layers vs. 2–3</span>
  </div>
  <div v-click.fade class="accent-card">
    <strong>Large Batch</strong>
    <span>2,048 batch size</span>
  </div>
  <div v-click.fade class="accent-card">
    <strong>Fewer Updates</strong>
    <span>2 updates / 1,024 transitions</span>
  </div>
  <div v-click.fade class="accent-card">
    <strong>Code Optimization</strong>
    <span>JIT compiled and mixed precision</span>
  </div>
</div>

<!--
Scaling idea is from Kaplan et al.: spend compute on model size and batch size, not on step count.

1,024 envs: SAC and TD3 were often run with only a few environments. Here the throughput is what adequately covers the state–action space for diverse trajectories

10M buffer: in high dimensions, overwriting a rare pair causes catastrophic forgetting and extrapolation error. The large buffer preserves long-tail experience.

2.5M / 6 layers is for both the actor and the critic. The appendix describes this as 2 inverted-residual blocks, width 128 for the actor and 256 for the critic. (normally this would make the critic unstable!)

Batch 2,048 nearly saturates the GPU. The paper also credits a higher learning rate; the appendix schedule cosine-decays from 3e-4 to 1.5e-4.

Update ratio: the main text says 2 gradient steps per 1,024 new transitions. The hyperparameter table lists 2/2048. Either reading is a tiny update-to-data ratio. Infrequent updates are usually too weak in off-policy RL.

JIT (just in time) compiles the training step and the policy forward pass so Python is not dispatching every tensor op. That overhead is a large fraction of wall-clock time when you step 1,024 environments and update a big network. Mixed precision runs matrix multiplication in 16 bit floats for speed, while keeping a stable master copy of the weights for optimization to be stable. The paper measures a 5–10% wall-clock cut. Neither change alters the learning rule.

Again, this recipe was hard to use because a bigger critic amplifies bootstrap error. The next slide is what makes the larger model trainable.
-->

---
layout: default
class: stable-training
---

# 2. Stable Training

<blockquote v-click.fade>

Bound weight, feature, and gradient norms so bootstrap errors do not compound.

</blockquote>

<div class="stable-body">
  <ThemeImage v-click.fade src="/images/figure2.png" alt="Inverted residual blocks with pre-activation batch norm and a final RMSNorm" />
  <div class="stable-points">
    <div v-click.fade>
      <strong>Inverted residual backbone</strong>
      <span>Expand, project back, residual. RMSNorm after the last block.</span>
    </div>
    <div v-click.fade>
      <strong>Pre-activation batch norm</strong>
      <span>Normalize before each nonlinearity.</span>
    </div>
  </div>
</div>

<!--
The previous slide's larger critic makes this necessary. An error in Q(s', a') is written into the target for Q(s, a) and then amplified on the next update. The figure is this backbone. The other three mechanisms are training rules on the next slide, not extra blocks in the drawing. (actors width is 128, critic is 256, The actor ends in the guassian mean and spread, critic ouputs the value) 2 blocks for actor and critic

Inverted residual: each block expands the features (from d to 4d), projects back to the original width (4d to d), and adds a residual (gray line at the top which is a copy of the block's input, output is added to this), in the style of a Transformer feedforward block. The residual keeps gradients moving in a deeper net. RMSNorm (root mean square normalization) at the end bounds each sample's feature norm, so an out-of-distribution state cannot produce an unbounded activation for the bootstrap to chase.

Pre-activation batch norm: the replay buffer mixes many past policies, so the input distribution keeps shifting. Without normalization, activations saturate and ReLUs die. Batch norm is applied before each nonlinearity. They prefer it to layer norm because a large, diverse batch gives useful statistics, a smoother loss, and a lower condition number.
-->

---
layout: default
class: stable-training
---

# 2. Stable Training

<blockquote v-click.fade>

Bound weight, feature, and gradient norms so bootstrap errors do not compound.

</blockquote>

<v-clicks animation="fade">

- **Cross-batch targets:** current $Q(s,a)$ and next state $Q(s',a')$ share one batch
- **Distributional critic:** categorical $Q$ on $[G_{\min},G_{\max}]$, with normalized rewards

</v-clicks>
<v-clicks animation="fade" at="3">

$$
\bar r_t=\frac{r_t}{\max\big(\sqrt{\sigma_{t,G}^2+\epsilon},\, G_{t,\max}/G_{\max}\big)}
$$

</v-clicks>


<v-clicks animation="fade" at="4">

- **Weight normalization:** project $w$ to unit length, and normalization parameter vectors ($\gamma, \beta$) to norm $\sqrt{d}$

</v-clicks>

<!--
Cross-batch targets: batch-norm statistics depend on which samples are in the forward pass. If Q(s, a) and the target Q(s', a') are normalized separately, the Bellman residual compares numbers on different scales. Concatenate the current and next-state pairs into one batch so both share the same statistics. This is the CrossQ idea. FlashSAC still keeps the slow target networks from the SAC slide.

Distributional critic: Q outputs probabilities for each of 101 bins on [-5, 5], trained with cross-entropy against the projected Bellman target. Those two numbers are the experimental setting in Appendix Table 9, not a value derived in the text. A distribution is less sensitive to one noisy backup than a single squared error. The fixed range only works if returns stay inside it. σ²_{t,G} is a running variance of discounted return, G_{t,max} is a running maximum magnitude, and G_max is the edge of the support. The denominator uses whichever of those scales is larger, so rewards shrink when returns would otherwise leave the interval.

Weight normalization: the paper says each normalization parameter vector, γ and β, is projected to norm √d. They are the scale and shift (x=scale*x+shift) of a normalization layer, and each is its own vector with one entry per feature. d is the length of that vector, the feature width of the layer. √d keeps a typical entry near size 1. A unit-length vector of width d would shrink each entry like 1/√d as the layer got wider. w is a separate weight vector and is projected to length 1, not √d. The network has to store information in direction, not magnitude. Unchecked weight growth inflates Q variance, and that variance is what bootstrapping amplifies. On its own this piece is a small gain; they keep it because it helps when samples are limited.
-->

---
layout: default
class: exploration
---

# 3. Exploration

<blockquote v-click.fade>

One noise scale for every robot, and action noise that persists across steps.

</blockquote>

<v-clicks animation="fade" every="2">

**Unified entropy target:** Parameterize the target entropy via $\sigma_{\mathrm{tgt}}=0.15$

$$
\bar{\mathcal H}=\frac{|\mathcal A|}{2}\log\big(2\pi e\,\sigma_{\mathrm{tgt}}^2\big)
$$


**Noise repetition:** Sample $\epsilon\sim\mathcal N(0,I)$ and hold it for $k$ steps. Draw $k$ from a zeta distribution, capped at 16:

$$
P(k)\propto k^{-s},\qquad s=2,\qquad k\in\{1,\ldots,16\}
$$

</v-clicks>

<!--
Off-policy learning can choose how to explore without tying that choice to the current policy. SAC already tunes its temperature automatically, but the target entropy is usually set by hand for each task. That does not travel across robots with different action dimensions.

alpha can be trained in FlashSAC! After updating the actor and critic, also take a gradint step on alpha so the policies entropy moves toward H

The formula is the entropy of a diagonal Gaussian whose standard deviation is σ_tgt on every action coordinate. It grows in proportion to the number of action dimensions (A), so a 37-DoF humanoid and an 8-DoF arm share the same σ_tgt. The value 0.15 is used in every experiment. Varying it from 0.05 to 0.25 changes the curves very little. The best region is about 0.15 to 0.2.

N is the gaussian distribution, I is the identity matrix - each joint gets it's own noise
Independent noise at every step is a poor explorer in contact-rich control: the dynamics wash it out. Pink noise and Ornstein–Uhlenbeck noise fix that, but each environment needs its own noise process. With 1,024 environments that state is expensive.

Noise repetition is the cheap substitute. Sample one noise vector and add that same vector for k steps. The policy still sees the new state every step. Only the exploration offset stays fixed. k follows a zeta distribution with exponent s = 2, and the appendix caps k at 16. Most holds are short. Occasionally one lasts long enough to commit to a shove or a gait change. Removing the repetition slows learning and lowers the final score. Basically you draw a k, hold the noise that long, draw a new k and repeat
-->
