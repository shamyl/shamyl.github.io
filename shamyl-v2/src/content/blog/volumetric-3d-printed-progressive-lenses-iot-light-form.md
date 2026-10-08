---
title: "Volumetric 3D Printing Goes Commercial: IOT's Light-Form Lenses Change How Prescription Eyewear Is Made"
date: 2026-10-08
description: "IOT and VisionLab have launched the first commercially available volumetric 3D printed progressive lenses in Spain. The Light-Form process cures an entire lens in a single flash of light, cutting energy use by 90% and eliminating water consumption. Here is what the technology does, how it differs from layer-based 3D printing, and what it means for manufacturing beyond eyewear."
tags: ["3d-printing", "volumetric-3d-printing", "additive-manufacturing", "eyewear", "manufacturing", "product-development"]
featured: true
seoTitle: "Volumetric 3D Printed Lenses: IOT Light-Form Goes Commercial"
seoDescription: "IOT and VisionLab launched the first volumetric 3D printed progressive lenses. Light-Form cures a full lens in one flash of light, cutting energy 90% and eliminating water. What it means for manufacturing."
canonical: "https://shamylmansoor.com/blog/volumetric-3d-printed-progressive-lenses-iot-light-form/"
---

Volumetric 3D printing — a process that cures an entire object in a single exposure of light rather than building it layer by layer — has moved from research labs to a consumer product. On October 6, 2026, Spanish optical technology company IOT and retailer VisionLab announced the first commercially available progressive eyeglass lenses made using Light-Form Technology, IOT's volumetric photopolymerization process. The lenses are now on sale through VisionLab's retail network in Spain, making this the first time a volumetric 3D printing process has reached consumers in a mainstream product category.

## In Brief

- IOT's Light-Form Technology uses controlled volumetric photopolymerization to cure a complete progressive lens in seconds using a single flash of light
- VisionLab is the first retailer worldwide to offer lenses made with the process, marking the technology's first commercial deployment
- Compared to conventional lens manufacturing, Light-Form eliminates water consumption, cuts energy use by 90%, and reduces waste by 76%
- IOT was founded in Madrid in 2005 as a spin-off of Complutense University of Madrid; its technologies are used in approximately 35 million lenses worldwide annually
- The process differs fundamentally from layer-based 3D printing and from the inkjet approach previously developed by Luxexcel (now owned by Meta)
- IOT sees smart glasses and AR eyewear as the next frontier for the technology

## What Volumetric 3D Printing Actually Does

Most 3D printing processes build objects incrementally. FDM extrudes plastic one line at a time. SLA and DLP cure resin layer by layer. Even inkjet-based 3D printing, like the process Luxexcel developed for prescription lenses, deposits material droplet by droplet. Each approach shares a common limitation: the object is assembled sequentially, which introduces layer lines, mechanical anisotropy, and production time that scales with part complexity.

Volumetric 3D printing works differently. Instead of building a part slice by slice, it cures the entire volume of a photopolymer resin in a single exposure. The process relies on controlled light fields — typically generated using a projector or laser system — that create a three-dimensional energy distribution inside a vat of liquid resin. Where the light intensity exceeds the polymerization threshold, the resin solidifies. Where it does not, the resin remains liquid. The result is a complete, fully formed part produced in one step.

The technical challenge is computing the correct light pattern. The resin's optical properties — absorption, scattering, refraction — determine how light propagates through the volume. The algorithm must account for how light from different angles accumulates inside the resin to reach the cure threshold only at the desired locations. Research groups at Lawrence Livermore National Laboratory, EPFL, and the University of California, Berkeley have published extensively on the underlying physics, and several startups have attempted to commercialize variations of the approach.

IOT's Light-Form is the first documented case of volumetric 3D printing reaching a mainstream consumer market with a functional product.

## How Light-Form Applies to Prescription Lenses

Conventional ophthalmic lens production is a subtractive process. A blank lens is ground and polished to the required prescription using abrasive tools, coolants, and multiple polishing stages. Progressive lenses — which have continuously varying optical power across the surface — are particularly demanding because the geometry must transition smoothly between distance, intermediate, and reading zones without visible lines or abrupt distortions.

Light-Form replaces grinding and polishing with controlled volumetric photopolymerization. According to IOT, the process produces a complete progressive lens in seconds, in a single step, using one flash of light. The resulting lenses meet the precision and optical quality standards required for commercial prescription eyewear, which means they pass the same regulatory and performance benchmarks as conventionally manufactured lenses.

The key innovation is not just speed. It is that the entire lens geometry — including the complex progressive surface profile — forms simultaneously throughout the resin volume, rather than being shaped incrementally. This eliminates the surface defects, subsurface damage, and tool marks that grinding can introduce, and it removes the need for post-polishing.

## The Sustainability Math

IOT reports three environmental metrics for Light-Form compared to conventional lens manufacturing:

- **Water consumption: eliminated entirely.** Traditional lens grinding uses water as a coolant and lubricant; Light-Form uses none.
- **Energy use: reduced by 90%.** Grinding and polishing require powered machinery operating for several minutes per lens; Light-Form cures in seconds.
- **Waste: reduced by 76%.** Conventional production removes material from a blank to reach the final shape; Light-Form builds only the material needed.

These figures come from IOT and have not been independently verified by a third party. However, the directional claim — that volumetric photopolymerization is more resource-efficient than subtractive grinding — is consistent with the fundamental physics of each process. Removing material from a blank inherently produces waste; curing a volume produces only the intended part.

## How This Differs From Luxexcel and Meta's Approach

The connection between 3D printing and prescription lenses is not new. Dutch company Luxexcel developed an inkjet-based process for 3D printing prescription lenses and was later [acquired by Meta](https://www.theverge.com/2023/1/26/23573715/meta-luxexcel-prescription-smart-glasses-acquisition), which wanted the technology to integrate prescriptions into its smart glasses hardware. The logic was straightforward: if you are building AR glasses that people wear for hours, the lenses need to correct their vision.

Luxexcel's approach deposited UV-curable resin droplet by droplet to build a lens. It worked, but it was slow, required a large and expensive machine, and the resulting lenses faced questions about optical clarity at scale. According to VoxelMatters, which visited Luxexcel before the acquisition, the company was running a large and complex 3D printing system whose real-world production potential was clear but difficult to realize.

IOT's Light-Form uses a different physical principle. Instead of depositing material incrementally, it cures the entire lens volume at once. This means production time does not scale with lens complexity — a simple spherical lens and a complex progressive lens take the same single exposure. The equipment is also more compact, according to IOT, which matters for deployment in retail optical labs rather than centralized factories.

The comparison matters for product teams. If you are building smart glasses that require prescription lenses, you now have two 3D printing approaches to evaluate: inkjet deposition (Luxexcel/Meta) and volumetric photopolymerization (IOT/Light-Form). Each has different trade-offs in speed, optical quality, material properties, and equipment footprint.

## Why This Matters Beyond Eyewear

The commercial validation of volumetric 3D printing in a regulated consumer product has implications that extend far beyond lenses. For product teams and manufacturing engineers, it answers a question that has hovered over volumetric printing since it was first demonstrated in research settings: can it produce parts that meet real-world quality standards at commercial scale?

Lens manufacturing is a useful test case because the requirements are strict. Ophthalmic lenses must meet precise optical power tolerances, surface quality standards, and regulatory requirements across multiple jurisdictions. If Light-Form lenses pass these checks and reach consumers through a mainstream retail chain, it demonstrates that volumetric printing can deliver functional, regulated products — not just laboratory curiosities.

For hardware product teams, this opens several lines of thinking:

- **Customization at scale:** Volumetric printing produces each part from a digital model, which means every lens can be unique without additional tooling cost. This is the same advantage that makes 3D printing attractive for [mass-produced structural components like Apple's titanium hinge](/blog/apple-iphone-duo-3d-printed-titanium-hinge-manufacturing/), but applied to a process that is faster and more resource-efficient.
- **Distributed manufacturing:** If the equipment is compact enough for retail labs, production can move closer to the customer. This reduces inventory, shipping, and lead times — a model that has implications for any industry where personalized products are currently made in centralized facilities.
- **Sustainability claims with physics behind them:** The 90% energy reduction and zero water consumption are not marketing embellishments; they are structural consequences of replacing a subtractive process with a additive one. For teams building [sustainable manufacturing processes](/blog/nigeria-naseni-metal-additive-manufacturing-hub-developing-countries/), this is a useful reference case.

## For Educators and Makers

For STEAM educators, the Light-Form story is a teaching opportunity because it connects several disciplines in a single real-world product:

- **Physics:** How volumetric light fields work, why photopolymerization thresholds matter, how optical absorption affects cure depth
- **Materials science:** Photopolymer resin chemistry, crosslinking behavior, optical clarity requirements
- **Manufacturing engineering:** The shift from subtractive to additive processes, what that means for resource efficiency and production flow
- **Product design:** How a new manufacturing process changes what is possible — lenses with geometries that grinding cannot produce, produced in seconds rather than minutes

For makers interested in volumetric printing, the barrier to entry remains high. The light field computation requires specialized software, and the resin formulations are proprietary. But the trajectory is familiar: what starts in a specialized lab with expensive equipment eventually becomes accessible. Desktop SLA printers followed this path over the past decade. Volumetric printing may follow the same curve, and commercial deployments like Light-Form are the first signal that the technology is maturing.

## What to Watch Next

Several developments will determine whether volumetric 3D printing expands beyond lenses:

- **Material range.** Light-Form currently uses a photopolymer resin optimized for optical clarity. Volumetric printing has been demonstrated with other material families in research settings, but commercial deployment requires formulations that meet specific industry standards for mechanical properties, durability, and regulatory approval.
- **Part size.** Lenses are small and optically transparent, which makes them ideal for light-based curing. Larger or opaque parts are harder to produce volumetrically because light penetration depth becomes a limiting factor.
- **Meta's response.** If Light-Form proves viable for prescription smart glasses, Meta may need to evaluate whether its Luxexcel inkjet approach remains competitive or whether a shift to volumetric technology makes sense.
- **Geographic expansion.** Light-Form lenses are currently available only through VisionLab in Spain. IOT operates in over 70 countries, but regulatory approval and retail partnerships will determine how quickly the technology reaches other markets.
- **Cost at scale.** IOT has not published per-lens production costs. The sustainability metrics are strong, but the business case will depend on whether the equipment cost, resin cost, and throughput can compete with the highly optimized conventional lens manufacturing infrastructure that exists today.

## Product Builder's Perspective

From a product-building perspective, the most significant aspect of Light-Form is not the lens itself — it is the proof that volumetric 3D printing can meet commercial quality standards in a regulated consumer product. The gap between a laboratory demonstration and a product that consumers can buy is enormous. It requires solving material consistency, process reliability, quality assurance, regulatory compliance, and retail distribution. IOT and VisionLab have crossed that gap.

For technology teams evaluating additive manufacturing for their own products, Light-Form is a data point worth tracking. It suggests that volumetric printing is further along the commercialization curve than many assumed, and that the process may be viable for applications beyond optics — particularly any product where personalization, speed, and material efficiency matter.

For Pakistani technology teams and educators, the IOT story also illustrates something important: the company was founded as a university spin-off in Madrid and spent over two decades developing the technology before reaching commercial deployment. Deep-tech manufacturing innovation is a long game, and the companies that succeed are often those that combine academic research, patient capital, and a clear path to a specific market.

## Sources

- [VoxelMatters: IOT and VisionLab bring the first volumetric 3D printed progressive lenses to consumers](https://www.voxelmatters.com/iot-and-visionlab-bring-the-first-volumetric-3d-printed-progressive-lenses-to-consumers/) — published October 7, 2026
- [IOT company information](https://www.iot-lens.com/) — IOT (Indo Optical Technologies), founded 2005, Madrid, Spain
- [The Verge: Meta acquires Luxexcel for prescription smart glasses](https://www.theverge.com/2023/1/26/23573715/meta-luxexcel-prescription-smart-glasses-acquisition) — published January 2023
- [VoxelMatters: Engo 3D prints super-light titanium AR-enabled running glasses](https://www.voxelmatters.com/engo-3d-prints-super-light-titanium-ar-enabled-running-glasses/) — published October 6, 2026