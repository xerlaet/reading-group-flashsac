---
section: Introduction
layout: default
---

# Results Preview

<ThemeImage class="preview-figure" src="/images/figure1.png" />

<!--
Figure 1 groups tasks by state and action dimensionality
- Low dimensional: FlashSAC ties with PPO
- High dimensinal: FlashSAC gets a higher return with a lower wall-clock time (elapsed time during training)
- Sim to Real: FlashSAC works within minutes, PPO requires hours

The reasoning for this gap is what the next slides will explain
-->

---
layout: default
---

# On-Policy, Until the Task Gets Large

<div class="pair-grid">
  <div v-click.fade class="accent-card">
    <strong>Still a good fit</strong>
    <span>Quadrupeds and gripper arms. Low dimension, cheap parallel simulation, and a wasted batch barely matters.</span>
  </div>
  <div v-click.fade class="accent-card">
    <strong>No longer the typical task</strong>
    <span>Humanoids, dexterous hands, and vision. The on-policy batch is narrow, and simulation is more expensive.</span>
  </div>
</div>

<v-clicks animation="fade" at="3">

> Throwing that batch away is then the bottleneck, in samples and in wall-clock time.

</v-clicks>

<!--
While imitation learning can yield impressive results, RL works when expert demonstrations are unavailable, incomplete, or insufficient

Low-dimension tasks: PPO is great b/c:
- stable
- easy to tune
- discarding old data is fine when new data can be collected cheaply

Higher-dimension tasks
- larger state space, so more on-policy data is needed
- simulation is slower b/c contact, larger networks.

Throwing the batch away after a few epochs wastes samples and wall-clock time. More in the related work slide. The question for now is what you reach for instead.
-->

---
layout: default
---

# Off-Policy, Why It Stalls

<div class="pair-grid">
  <div v-click.fade class="accent-card">
    <strong>The coverage is the point</strong>
    <span>Replay mixes many past policies, so the critic sees far more than the latest rollout.</span>
  </div>
  <div v-click.fade class="accent-card">
    <strong>The critic is the weak link</strong>
    <span>Fitting that diversity takes many updates, and each target is built from the critic itself.</span>
  </div>
</div>

<v-clicks animation="fade" at="1">

$$
(s,a,r,s') \in \mathcal D, \qquad a' \sim \pi(\cdot \mid s')
$$

</v-clicks>
<v-clicks animation="fade" at="2">

$$
\mathcal L_Q=\mathbb E_{\mathcal D}\!\left[\left(Q_\theta(s,a)-\big[r+\gamma Q_\theta(s',a')\big]\right)^2\right]
$$

</v-clicks>

<!--
Replay is the natural alternative

Buffer mixes many behavior policies, so the critic sees a broader distribution. However, this usually suffers from slow training and being unstable. a' comes from asking the current policy

The loss is bootstrapped Bellman error.
- Expected (average) for prediction of return for new = actual reward + return for next states onward
- Matching it takes many gradient steps, and errors at poorly supported pairs accumulate through repeated bootstrapping, esp with larger critic networks

So this seems promising, but needs work
-->
