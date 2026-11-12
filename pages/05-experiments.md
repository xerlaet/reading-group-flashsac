---
section: Experiments
layout: default
---

# GPU-Based Simulators (Low Dimensional)

<v-clicks animation="fade" at="1" every="3">
<ThemeImage class="experiment-plot at-325" src="/images/figure3-1.png" alt="Learning curves on low-dimensional GPU tasks" />
<ThemeImage class="experiment-plot at-470" src="/images/figure3-3.png" alt="Aggregate scores on low-dimensional GPU tasks" />

<div class="five-videos">
  <figure>
    <video src="https://holiday-robot.github.io/FlashSAC/videos/isaaclab/Isaac-Open-Drawer-Franka-v0.mp4" autoplay controls muted loop playsinline></video>
  </figure>

  <figure>
    <video src="https://holiday-robot.github.io/FlashSAC/videos/isaaclab/Isaac-Lift-Cube-Franka-v0.mp4" autoplay controls muted loop playsinline></video>
  </figure>

  <figure>
    <video src="https://holiday-robot.github.io/FlashSAC/videos/maniskill/PullCube.mp4" autoplay controls muted loop playsinline></video>
  </figure>

  <figure>
    <video src="https://holiday-robot.github.io/FlashSAC/videos/genesis/go2-walk.mp4" autoplay controls muted loop playsinline></video>
  </figure>

  <figure>
    <video src="https://holiday-robot.github.io/FlashSAC/videos/isaaclab/Isaac-Velocity-Flat-Anymal-C-v0.mp4" autoplay controls muted loop playsinline></video>
  </figure>
</div>
</v-clicks>

<!--
These are the low-dimensional half of the 25 GPU tasks: Franka gripper manipulation and quadruped locomotion, 15 tasks from IsaacLab, ManiSkill, and Genesis. FlashSAC and FastTD3 train for 50M steps. PPO trains for 200M, about three times the compute, so the comparison is not starving the on-policy method. FlashSAC uses one configuration everywhere and only changes γ to the simulator default. The baselines are tuned per task.

The paper's takeaway: FlashSAC is comparable to PPO here, and slightly ahead. When the state-action space is small and fresh simulation is cheap, on-policy data is already enough. FastTD3 is less reliable on this set. It fails or underperforms on tasks such as Go2 walk and Franka pull-cube, which are on this slide.
-->

---
layout: default
---

# GPU-Based Simulators (High Dimensional)

<v-clicks animation="fade" at="1" every="2">
<ThemeImage class="experiment-plot at-325" src="/images/figure3-2.png" alt="Learning curves on high-dimensional GPU tasks" />

<div class="five-videos">
  <figure>
    <video src="https://holiday-robot.github.io/FlashSAC/videos/isaaclab/Isaac-Repose-Cube-Allegro-Direct-v0.mp4" autoplay controls muted loop playsinline></video>
  </figure>

  <figure>
    <video src="https://holiday-robot.github.io/FlashSAC/videos/isaaclab/Isaac-Repose-Cube-Shadow-Direct-v0.mp4" autoplay controls muted loop playsinline></video>
  </figure>

  <figure>
    <video src="https://holiday-robot.github.io/FlashSAC/videos/mujoco-playground/T1JoystickFlatTerrain.mp4" autoplay controls muted loop playsinline></video>
  </figure>

  <figure>
    <video src="https://holiday-robot.github.io/FlashSAC/videos/isaaclab/Isaac-Velocity-Flat-G1-v0.mp4" autoplay controls muted loop playsinline></video>
  </figure>

  <figure>
    <video src="https://holiday-robot.github.io/FlashSAC/videos/isaaclab/Isaac-Velocity-Rough-G1-v0.mp4" autoplay controls muted loop playsinline></video>
  </figure>
</div>
</v-clicks>

<!--
These are the 10 high-dimensional tasks: Allegro and Shadow cube reorientation, and humanoid locomotion on the Unitree G1 and H1 and the Booster T1. Same training budgets as the previous slide. PPO still receives 200M steps.

This is the result the method is built for. FlashSAC reaches a higher return in less wall-clock time than PPO. Against FastTD3, FlashSAC is more stable across the suite. Where both succeed, FlashSAC's larger network reaches a higher asymptote, and the biggest gap is on the humanoids. FastTD3 stays near 0.2M parameters, which the paper says caps its final performance.
-->

---
layout: default
class: cpu-vision
---

<div class="split-plots">
<section v-click.fade>
<h1>CPU-Based Simulators</h1>
<ThemeImage src="/images/figure4.png" alt="Learning curves on CPU-based benchmarks" />
</section>
<section v-click.fade>
<h1>Vision-Based Simulators</h1>
<ThemeImage src="/images/figure5.png" alt="Learning curves on vision-based DMControl tasks" />
</section>
</div>

<!--
Top: 40 single-environment tasks from MuJoCo, DMControl, HumanoidBench, and MyoSuite. Sample efficiency matters more than throughput, so the GPU recipe is relaxed to a 1M buffer, batch 512, and one update per new transition. Baselines are PPO, XQC, SimbaV2, TD-MPC2, and MR.Q. PPO does poorly because it cannot reuse data. FlashSAC matches or beats the sample-efficient methods, including the model-based ones, with one configuration. Those methods spend extra compute on a learned dynamics model and planning.

Bottom: 8 vision tasks from DMControl, 1M steps, action repeat 2. Same smaller-data hyperparameters, plus the DrQ-v2 setup: a small convolutional encoder, a stack of the three latest frames, and 3-step returns. FlashSAC matches or exceeds DrQ-v2 and MR.Q and converges faster in wall-clock time. DrQ-v2 is sample-efficient but unstable, and it fails to converge on tasks such as Finger Turn Hard. MR.Q reaches a high score and pays for an auxiliary dynamics loss. The paper notes that loss could be added on top of FlashSAC. The critic constraints do not replace representation learning.
-->

---
layout: default
---

# Sim-to-Real Transfer

<div class="quadrant-grid">
  <v-clicks animation="fade" at="1">
  <div class="video-trio">
    <figure>
      <video src="https://holiday-robot.github.io/FlashSAC/videos/sim-to-real/g1_walking.mp4" autoplay controls muted loop playsinline></video>
      <figcaption>G1 Walking</figcaption>
    </figure>
    <figure>
      <video src="https://holiday-robot.github.io/FlashSAC/videos/sim-to-real/g1_turning.mp4" autoplay controls muted loop playsinline></video>
      <figcaption>G1 Turning</figcaption>
    </figure>
    <figure>
      <video src="https://holiday-robot.github.io/FlashSAC/videos/sim-to-real/g1_push.mp4" autoplay controls muted loop playsinline></video>
      <figcaption>G1 Push Perturbation</figcaption>
    </figure>
  </div>
  </v-clicks>
  <v-clicks animation="fade" at="1">
  <div class="image-cell">
    <ThemeImage src="/images/sim-to-real-flat.png" alt="Flat-terrain sim-to-real comparison" />
  </div>
  </v-clicks>

  <v-clicks animation="fade" at="2">
  <figure class="bottom-video">
    <video
      src="https://holiday-robot.github.io/FlashSAC/videos/sim-to-real/g1_stair.mp4"
      autoplay controls muted loop playsinline
    ></video>
    <figcaption>G1 Stair</figcaption>
  </figure>
  </v-clicks>

  <v-clicks animation="fade" at="2">
  <div class="image-cell">
    <ThemeImage src="/images/sim-to-real-rough.png" alt="Rough-terrain sim-to-real comparison" />
  </div>
  </v-clicks>

</div>

<!--
Blind locomotion on a 29-DoF Unitree G1. Both methods use the same reward, domain randomization, and terrain curriculum: stairs from 0 to 23 cm, plus grids, waves, and pits. Both use a DreamWaQ-style context estimator and an asymmetric actor-critic. The critic sees contact states and a height map during training. The actor does not.

On flat ground, FlashSAC produces a policy that walks on the real robot after about 20 minutes of simulation training. PPO needs about 3 hours for a comparable policy. The same policy walks forward, backward, and sideways without retraining.

The stair result is the stronger one. The real stairs are 15 cm high and 60 cm deep, a size the robot did not see in training. FlashSAC climbs them after about 4 hours. PPO needs about 20 hours for the same capability. Overall the paper reports about a tenfold cut in training time, with stable behavior on the real robot.
-->
