---
section: Preliminary
layout: default
---

# Markov Decision Process

<div v-click.fade>

- Robotic control is modeled as a discounted MDP

$$
\mathcal M=(\mathcal S,\mathcal A,P,r,\gamma)
\qquad
s\in\mathcal S,\ 
a\in\mathcal A,\ 
P(s'\mid s,a),\ 
r(s,a),\ 
\gamma\in[0,1)
$$

</div>

<v-clicks animation="fade">

- Each step observes $s_t$, samples $a_t$, receives $r_t$, and draws $s_{t+1}$
- $\pi(a\mid s)$ maximizes the discounted return $J(\pi)$

</v-clicks>

<v-clicks animation="fade" at="3">

$$
\max_{\pi} J(\pi)=\mathbb E_{\pi}\left[\sum_{t=0}^{\infty}\gamma^t r(s_t,a_t)\right]
$$

</v-clicks>

<!--
Cover the RL framework and algorithmic foundation that FlashSAC is built upon.

The paper models robotic control as a discounted MDP. S is the state space. A is the continuous action space. P(s'|s,a) is the transition dynamics. r(s,a) is the reward function. γ in [0, 1) is the discount factor. Those are the symbols on the first line.

At each time t the agent observes s_t, samples a_t, receives r_t = r(s_t, a_t), and transitions to s_{t+1} drawn from P given s_t and a_t.

The second line is the goal. The paper says a policy π(a|s) maximizes the discounted sum of rewards. J(π) is that expected return.
-->

---
layout: default
---

# Soft Actor-Critic (SAC)

<div v-click.fade>

- Store $(s,a,r,s')$ from past policies in replay buffer $\mathcal D$, and train from it

</div>

<v-clicks animation="fade">

- Entropy regularization, weighted by $\alpha>0$, encourages exploration
- **Clipped double Q-learning:** Two critics $Q_{\phi 1}$ and $Q_{\phi 2}$

</v-clicks>

<v-clicks animation="fade" at="3">

$$
\mathcal L_\pi (\theta) = \mathbb E\left[\alpha\log\pi_\theta(a\mid s)-\min_{i=1,2} Q_{\phi_i}(s,a)\right]
$$

</v-clicks>

<!--
FlashSAC builds off of SAC, a widely used off-policy RL algorithm

Stores information in a replay buffer and trains on samples from it

Entropy regularization is important for exploration which allows the buffer to cover lots of areas and reduce approximation and extrapolation error (log pi is large and negative when actions are unlikely, and near 0 or positive when its confident)

Maintains two active-value functions Q1 and Q2. The only difference is that they start with different initial random values. The min of the estimates (of the exected return given that action) is used, reducing impact of optimistic value errors so it's more conservative

Note: log turns the policy bell curve into a downward facing parabola. alpha stretches the parabola (doesn't affect it crossing zero), so a larger alpha tries to keep the parabola low which means a wider spread which is more exploration. Smaller alpha lets Q dominate, and policy sharpens around actions the critic likes
-->

---
layout: default
---

# Soft Actor-Critic (SAC)

<div v-click.fade>

- Target critics $\bar\phi_j$ track the online critics with a slow exponential moving average

</div>

<div v-click.fade>

$$
\bar\phi_j\leftarrow\tau\phi_j+(1-\tau)\bar\phi_j,\qquad j\in\{1,2\},\ \tau\in(0,1)
$$

</div>

<div v-click.fade>

- Critic weights are optimized by minimizing Bellman loss, with target $y$

</div>

<div v-click.fade>

$$
\begin{gather*}
\mathcal L_{Q_i} = \mathbb E_{\mathcal D}[(Q_{\phi_i}(s,a)-y)^2] \\
y = r+\gamma\left[\min_{j=1,2}Q_{\bar\phi_j}(s',a')-\alpha\log\pi_\theta(a'\mid s')\right],\quad a'\sim\pi_\theta(\cdot\mid s')
\end{gather*}
$$

</div>

<!--
There are four Q networks. Two online critics, Q_φ1 and Q_φ2, are trained by gradient descent. Each has a target copy, Q_φ-bar. The targets are not trained. They lag the online weights.

The target exists so the bootstrap does not chase itself. y is built from the slow copies, then the online critic is fit to y. If the same weights were on both sides, every step would move the number the critic is trying to match.

The update is an exponential moving average. τ = 0.01 keeps 99% of the old target and mixes in 1% of the current online weights. τ = 1 would copy the online network every step. τ = 0 would freeze the target. This τ is not Adam's momentum.

y is the one-step target. r and s' come from the buffer. a' is sampled from the current policy at s'. The min over the two target critics drops the more optimistic one. Subtracting α log π puts the same entropy bonus into the value that the actor is paying for. Both online critics regress to that same y.

y = reward just received, plus a discounted, conservative, entropy-adjusted guess of what comes next.
-->
