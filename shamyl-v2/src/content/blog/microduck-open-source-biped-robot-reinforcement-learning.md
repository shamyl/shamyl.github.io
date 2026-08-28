---
title: "Microduck: The $399 Open-Source Biped Robot That Learns to Walk Through Reinforcement Learning"
date: 2026-08-28
description: "Pollen Robotics' Microduck is a 25 cm open-source bipedal robot with 15 motors, LiDAR, and a camera — pre-ordering at $399 with fully open-source RL training. Here is what it means for educators, makers, and robotics builders."
tags: ["robotics", "open-source", "reinforcement-learning", "EdTech", "maker", "hardware"]
featured: true
seoTitle: "Microduck: $399 Open-Source Biped Robot with RL Training"
seoDescription: "Pollen Robotics' Microduck is a 25 cm open-source biped robot with 15 motors, LiDAR, and reinforcement learning policies. Pre-orders opened August 27 at $399. Here is what educators and builders need to know."
canonical: "https://shamylmansoor.com/blog/microduck-open-source-biped-robot-reinforcement-learning/"
---

Pollen Robotics opened pre-orders for Microduck on August 27, 2026 — a 25 cm, 800-gram bipedal robot that walks, kicks, grabs objects, and even roller-skates using reinforcement learning policies trained in simulation. At $399 before taxes and shipping, it is one of the most affordable programmable robots with sim-to-real RL capabilities ever made available to the public. The entire software stack is open-source under the Apache-2.0 license, and the robot ships with seven pre-trained behaviors ready to use out of the box.

## In Brief

- Microduck is a 25 cm bipedal robot with 15 servo motors, a camera, LiDAR, and two IMUs, built by Pollen Robotics (now part of Hugging Face)
- Pre-orders opened August 27, 2026 at $399; shipping is targeted before Christmas 2026
- All robot software is Apache-2.0 licensed, with the RL training stack in a separate repository using MuJoCo and PPO
- The robot ships with 7 pre-trained policies: walk, sit/stand, kick, grab, roller skate, get back up, and quack
- Behaviors are trained in a physics simulator and deployed to the robot — users can retrain and share new policies through Hugging Face

## What Is Microduck?

Microduck is the newest robot from Pollen Robotics, a French company now part of Hugging Face that previously built Reachy, a larger interactive robot used in research and education. Where Reachy was designed as a social robot for human-robot interaction studies, Microduck is explicitly built for locomotion and reinforcement learning.

The robot is small — about 25 centimeters tall and weighing roughly 800 grams. Its brain is a Rockchip RK3566 system-on-chip running a 50 Hz control loop that drives fifteen servos. The sensor stack includes a camera, a time-of-flight LiDAR sensor, and two inertial measurement units. It connects via USB-C for charging and Bluetooth for gamepad control.

According to the company, every Microduck ships with seven pre-trained policies that work immediately: a velocity-tracking walking gait, sitting and standing, kicking a ball, grabbing objects with its beak, roller skating (when skate attachments are equipped), self-recovery from a fallen position, and a quacking voice. Each behavior is a neural network policy that can be swapped, retrained, or replaced.

## How the Reinforcement Learning Pipeline Works

The technical architecture is what sets Microduck apart from other affordable robots. The project is split across two GitHub repositories:

- **[microduck](https://github.com/pollen-robotics/microduck)** — the robot's onboard software, written in Rust. It includes the control loop daemon (`robotd`), the update system (`updaterd`), Bluetooth daemon (`btd`), gamepad handler (`padd`), camera streaming via WebRTC (`mediad`), and the depth sensor service (`tofd`). All daemons communicate over JSON-RPC on Unix sockets.
- **[microduck_rl](https://github.com/pollen-robotics/microduck_rl)** — the training stack, which uses MuJoCo for physics simulation and Proximal Policy Optimization (PPO) for policy learning. Trained policies are exported to ONNX format, which the robot loads and executes.

The sim-to-real workflow follows a well-established pattern in robotics research: train a policy in a physics simulator with domain randomization (varying friction, mass, motor dynamics, and other physical parameters to make the policy robust), then deploy the resulting neural network directly on the physical robot. Users can train new behaviors on their own machine or use Hugging Face Jobs for cloud training, then deploy to the robot in what the company describes as "one step from simulation to the real thing."

The robot also supports SSH access (`ssh microduck`) and provides command-line tools (`robotctl`) for configuration, monitoring, and updates. This makes it a genuine developer platform rather than a closed consumer toy.

## Why This Matters for Education

For STEAM educators and educational robotics programs, Microduck represents a significant shift in what is accessible. Consider the typical educational robotics landscape: most affordable robots under $400 use either remote control with no autonomous behavior, or simple pre-programmed movements via block-based coding. Reinforcement learning — the same technique used to train humanoid robots like Boston Dynamics' Atlas and Tesla's Optimus — has been largely inaccessible at this price point.

The closest comparisons in the educational space are platforms like the [NVIDIA Isaac GR00T reference humanoid](/blog/nvidia-isaac-groot-reference-humanoid-robot-academic-research/), which targets university research labs at a significantly higher cost, or simulation-only environments where students train policies that never touch real hardware. Microduck bridges this gap by providing both the physical robot and the full training pipeline at a price that individual learners or small school programs could realistically afford.

From a curriculum perspective, the sim-to-real loop is one of the most important concepts in modern robotics. Students can see, in a concrete and hands-on way, how a policy trained in a simulated environment transfers (or fails to transfer) to physical hardware. This is not a theoretical exercise — it is the same workflow used by professional robotics engineers at companies like Boston Dynamics, Agility Robotics, and Unitree. The domain randomization challenges, the sim-to-real gap, and the iteration cycle of train-deploy-refine are all real engineering problems that Microduck makes tangible.

## What This Means for Makers and Hardware Builders

The open-source hardware approach is notable. While the mechanical designs are not fully open-source in the traditional sense (the CAD files are not explicitly listed as open hardware), the software stack is permissively licensed under Apache-2.0, and the entire system architecture is documented in the repository's design docs. This includes the daemon architecture, the motor bus design, the update verification system, and the JSON-RPC communication protocol.

For hardware product builders, there are practical lessons in how Pollen Robotics has structured the robot's software. The decision to use Rust for all system daemons, the JSON-RPC-over-Unix-sockets communication pattern, and the signed-update-with-rollback system are all design choices that smaller robotics teams can learn from. The update system in particular — where every update is verified, health-gated, and reversible — addresses a problem that many hardware startups underestimate: how to safely push software updates to devices in the field without bricking them.

The integration with Hugging Face for policy sharing and cloud training is also worth studying. By making policy sharing a first-class citizen of the platform (the workflow explicitly includes "publish the policy" as step four), Pollen Robotics is betting that community-created behaviors will drive the robot's long-term value. This is the same dynamic that has made Hugging Face central to the NLP and computer vision communities, applied to physical robotics.

## Relevance to Pakistan and Emerging Tech Ecosystems

For technology builders in Pakistan and similar emerging markets, Microduck is relevant in two ways.

First, as a learning tool. The $399 price point, while still significant in local currency terms, is within reach of university labs, maker spaces, and serious self-learners. The fact that the full training pipeline is open-source means that students can learn reinforcement learning for robotics without needing access to a university robotics lab with expensive equipment. A student with a decent GPU and a Microduck can run the same sim-to-real pipeline that top research labs use.

Second, as a product design case study. Pollen Robotics is a relatively small company that has managed to build a sophisticated robot at a consumer-accessible price point. Their approach — using a commodity SoC (Rockchip RK3566) rather than a custom chip, standard servos rather than proprietary actuators, and leveraging the Hugging Face ecosystem for infrastructure — demonstrates that meaningful robotics products can be built without the resources of a Boston Dynamics or Tesla. For Pakistani hardware startups thinking about [building educational robotics platforms](/projects/learnosteam/), the Microduck playbook is worth studying.

The challenges of doing this in Pakistan are real: component sourcing, import duties on electronics, and the lack of local PCB manufacturing all add cost and complexity. But the Microduck bill of materials — commodity SoC, standard servos, ToF sensor, camera — consists of parts that are globally available and individually inexpensive. The expensive part of robotics is not the parts; it is the integration, the software, and the sim-to-real pipeline. Pollen Robotics has shown that a small team can nail that integration.

## Product Builder's Perspective

From a product-building perspective, several design decisions in Microduck stand out.

The choice of a bipedal form factor is bold. Bipedal locomotion is significantly harder than wheeled or quadrupedal locomotion, and most educational robots at this price point use wheels. By committing to bipedal walking via RL, Pollen Robotics is making a statement: reinforcement learning for locomotion has matured enough that a small robot can do it reliably at a consumer price point. This was not true two years ago.

The decision to ship pre-trained policies rather than asking users to train everything from scratch is important for the out-of-box experience. A robot that does nothing on day one is a poor educational tool — it needs to work immediately to build confidence, then open up for deeper exploration. The seven shipped policies provide that immediate gratification, while the open training stack provides the depth.

The Hugging Face integration is a strategic advantage that few robotics companies can match. Being part of Hugging Face gives Microduck access to the largest community of machine learning practitioners in the world, a familiar platform for sharing models, and cloud training infrastructure. For an independent robotics company, building this kind of community platform from scratch would be nearly impossible.

One open question is durability. A bipedal robot that is 25 cm tall and weighs 800 grams will fall, and falling is where small robots often break. The accessory pack includes spare motors and cables, which suggests Pollen Robotics expects wear and tear. How well the robot survives months of student use in a classroom setting remains to be seen.

## What to Watch Next

- **Shipping and real-world reviews**: Microduck is scheduled to ship before Christmas 2026. The gap between pre-order and shipping means that independent reviews of build quality, battery life, and sim-to-real reliability are still months away.
- **Community policy development**: The success of the platform depends on whether users actually create and share new behaviors. Watch the [Microduck GitHub repository](https://github.com/pollen-robotics/microduck) and Hugging Face for community-contributed policies.
- **Educational adoption**: Whether universities and schools integrate Microduck into robotics curricula will determine its long-term impact. The sim-to-real pipeline is pedagogically valuable, but curriculum integration requires more than a good robot — it needs teaching materials, lesson plans, and instructor support.
- **Competitive response**: If Microduck proves popular, expect similar products from other open-source robotics companies. The combination of RL locomotion and sub-$400 pricing is a new market segment.
- **Pakistan-specific opportunities**: If import costs can be managed, Microduck could be a viable platform for advanced robotics education in Pakistani universities. Maker spaces in Islamabad, Lahore, and Karachi that already have 3D printing and basic electronics capacity would be well-positioned to use it.

## Conclusion

Microduck is not just another educational robot. It is the first time that sim-to-real reinforcement learning for locomotion has been packaged into a $399 consumer product with fully open-source software. For educators, it offers a way to teach one of the most important concepts in modern robotics — the sim-to-real pipeline — with physical hardware that students can hold in their hands. For makers and hardware builders, it is a reference design for how small teams can build sophisticated robotics products using commodity components and open-source tooling.

The robot is not without limitations: it is small, bipedal walking is inherently fragile, and the real-world durability and sim-to-real gap will only become clear after shipping. But the approach — open-source, community-driven, integrated with the leading ML platform — is exactly the direction that educational robotics should be moving.

For anyone building [educational robotics platforms](/projects/robosim/) or working at the intersection of [STEAM education and hardware](/projects/buddy-bot/), Microduck is worth paying attention to.

## Sources

- [Pollen Robotics — Microduck product page](https://pollen-robotics.com/microduck/)
- [GitHub — pollen-robotics/microduck](https://github.com/pollen-robotics/microduck) (Apache-2.0, 559 stars as of August 28, 2026)
- [GitHub — pollen-robotics/microduck_rl](https://github.com/pollen-robotics/microduck_rl) (RL training stack)
- [Pollen Robotics homepage](https://pollen-robotics.com/) (confirms Hugging Face acquisition)
- [Hugging Face — pollen-robotics profile](https://huggingface.co/pollen-robotics)