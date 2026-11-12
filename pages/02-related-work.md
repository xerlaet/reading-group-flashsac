---
section: Related Work
layout: default
---

# On-Policy, Recent Work

<p v-click.fade><strong>PPO</strong> is the modern standard later on-policy methods are built on:</p>

<v-clicks animation="fade">

- Collect experience ($s,a,r,s'$) with a fixed rollout policy $\pi_{\mathrm{old}}$
- Estimate advantages $\hat A_t$ and perform several minibatch epochs using $L^{\mathrm{clip}}$
- Replace the rollout with fresh experience

</v-clicks>

<v-clicks animation="fade" at="3">

$$
L^{\mathrm{clip}}=\mathbb E_t\!\left[\min\!\left(\rho_t\hat A_t,\operatorname{clip}(\rho_t,1-\epsilon,1+\epsilon)\hat A_t\right)\right]
,\quad
\rho_t=\frac{\pi_\theta(a_t\mid s_t)}{\pi_{\mathrm{old}}(a_t\mid s_t)}
$$

</v-clicks>

<!--
Previously: discarding data hurts when the task gets large. Let's talk more about it, specifically PPO

Roll out with a fixed policy

Estimate advantages, and take several minibatch epochs. pi(a|s) is probability density of taking a in s. The ratio is the new policy over the policy that collected the batch. Clipping keeps that ratio near 1, so the update cannot leave the data it was computed on

After those epochs the batch is replaced

Later variants do not remove that limit. Importance sampling could reuse older rollouts, but the weights have high variance so it would be impractical. So there is still a fundamental bottleneck for higher dimensions
-->

---
layout: default
---

# Off-Policy, Recent Work
<v-clicks animation="fade" at="1">

- Recent work on off-policy methods fixes one bottleneck at a time:
</v-clicks>

<div class="takeaway-grid">
  <div v-click.fade="2" class="accent-card">
    <strong>Speed</strong>
    <span>FastTD3 and FastSAC push throughput, with networks around 0.2M parameters.</span>
  </div>
  <div v-click.fade="3" class="accent-card">
    <strong>Stability</strong>
    <span>CrossQ, SimBaV2, and XQC bound the critic, then need many updates.</span>
  </div>
  <div v-click.fade="4" class="accent-card">
    <strong>Exploration</strong>
    <span>Pink noise, OU noise, and action repeats make motion coherent.</span>
  </div>
</div>

<v-clicks animation="fade" at="5">

- <strong>FlashSAC</strong> is SAC with all three: fewer updates, a bounded critic, and cheap correlated noise

</v-clicks>

<!--
Recent work in off-policy (which skips the ratio because Q(s,a) answers for pairs in general, the old behavior's policy probability never enters the actor loss)

Speed: FastTD3 and FastSAC are a different pair of methods from FlashSAC. They already use parallel simulation and a large replay buffer, and they are fast on humanoids, but they stay near 0.2M parameters. A larger network was unstable under bootstrapping, so the final return is capped.

Stability: CrossQ puts batch norm in the critic and runs the current and next state through one batch. That shared batch is the cross-batch target FlashSAC keeps. SimBa, then SimBaV2, scales the network with hypersphere weight constraints and a distributional critic. XQC pushes the same idea, a well-conditioned critic loss. These methods reach a higher asymptote and then want more gradient steps, which is slow once the simulator is already producing data quickly.

Exploration: Ornstein–Uhlenbeck noise and pink noise are added to actions and sent to the simulator. This gives more coverage with state-action pairs. Coherent noise can make the data worth learning from, it does not fix a slow or unstable critic.

FlashSAC is SAC with all three: fewer updates on a larger model, a bounded critic, and that cheap correlated noise. The preliminary recalls the SAC update those pieces sit on.
-->
