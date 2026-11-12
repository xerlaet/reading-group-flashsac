---
layout: default
section: Conclusion
---

# Conclusion

<div class="takeaway-grid">
  <div v-click.fade class="accent-card">
    <strong>Alternative to PPO</strong>
    <span>Higher return, in less time, as the task gets larger.</span>
  </div>
  <div v-click.fade class="accent-card">
    <strong>Scale the model</strong>
    <span>Keep the data. Update less often, with a bigger batch.</span>
  </div>
  <div v-click.fade class="accent-card">
    <strong>Bound the critic</strong>
    <span>That is what makes the larger network trainable.</span>
  </div>
</div>

  <img v-click.fade class="cover-mark" src="/images/irvl-halloween.png" alt="IRVL" />


<!--
The lessons section frames FlashSAC as two mechanisms that belong together. Scaling data and model size while cutting the number of gradient updates is what makes training fast. The norm constraints are what keep that larger critic from amplifying its own errors. Exploration is the third piece, but the paper's closing point is that speed only works once the critic is stable.

On the tasks they evaluate, this is competitive with PPO in low dimensions and clearly ahead in dexterous manipulation and humanoid locomotion. The sim-to-real result is the sharp version of that: about a tenfold cut in training time on the G1, from hours to minutes on flat ground.

What they say this opens up: larger policies, vision and other rich sensors, slower but more realistic simulators, and mixing demonstrations with the agent's own data. The specific future direction they name is carrying the same critic constraints over to tactile sensing.
-->
