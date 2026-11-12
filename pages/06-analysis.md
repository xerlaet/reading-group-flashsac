---
section: Analysis
layout: default
---

# On-Policy vs Off-Policy

<ThemeImage class="analysis-hero" src="/images/figure7.png" alt="Off-policy replay covers a wider state-action region than the final policy" />

<!--
Trained for 1M steps on the Shadow Hand cube task, with a replay buffer of 1M. The plots are fingertip actions against the object's y position. The top clouds are the replay buffer. The bottom clouds are another 1M steps from the finished policy only.

Replay covers a much wider region, because it keeps transitions from many earlier policies. The final policy sits in a tight blob. The paper's point: in a high-dimensional task, on-policy data never sees most of the state-action space, and collecting enough on-policy coverage to match the buffer would be far more expensive.
-->

---
layout: default
class: ablations
---

<div class="ablation-stack">
  <div v-click.fade="1" class="h-[150px] mt-[-15px]">
    <p>Speed</p>
    <ThemeImage class="h-[153px] ml-[0px]" src="/images/figure8.png" alt="Ablations of buffer size, batch size, model size, and update ratio" />
  </div>
  <div v-click.fade="2" class="h-[175px]">
    <p>Stability</p>
    <ThemeImage class="h-[160px] ml-[15px]" src="/images/figure9.png" alt="Ablation adding each critic constraint, with norms and condition number" />
  </div>
  <div v-click.fade="3" class="h-[130px]">
    <p>Exploration</p>
    <ThemeImage class="h-[133px] ml-[10px]" src="/images/figure10.png" alt="Ablations of the entropy target and noise repetition" />
  </div>
</div>

<!--
All four panels are the same four IsaacLab tasks: Allegro and Shadow cube reorientation, and G1 locomotion on flat and rough terrain. This is an aggregate for all four tasks

Faster training. A larger replay buffer helps up to 10M transitions. At 50M, learning slows because recent high-quality samples are drawn less often, though the final score can be slightly higher if you train long enough. Larger batches, wider and deeper networks, and a lower update-to-data ratio all speed up convergence. The usual small critic, about width 128 and one block, is what limits that speed.

Stable training. Starting from a plain MLP, the pieces are added in order: residual blocks, batch norm, a final RMSNorm, the distributional critic with reward scaling, then weight normalization. a is what matters, the normalized score with everythiing. b-d show the norms during training, with constraints they stay flat which is healthy. The critic condition number is how stretched the loss is. A high condition number means a small step in one direction changes the loss a lot more than a step in another, so gradient descent is poorly behavied and errors amplofy (on a log scale). Overall, a means performance goes up, b-e say updates stay bounded and loss gets better conditioned

Exploration. The entropy target is varied from 0.05 to 0.25. The curves are similar across that range, and the best region is about 0.15 to 0.2, so one setting is enough. Turning off noise repetition slows learning and lowers the score.
-->
