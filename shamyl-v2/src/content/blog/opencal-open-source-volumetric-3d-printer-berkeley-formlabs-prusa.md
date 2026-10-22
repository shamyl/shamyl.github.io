---
title: "OpenCAL: UC Berkeley's Open-Source Volumetric 3D Printer You Can Build for $1,638"
date: 2026-10-22
description: "UC Berkeley has released OpenCAL, a build-it-yourself volumetric 3D printer based on Computed Axial Lithography, with Formlabs resin and Prusa distribution. The printer forms entire objects in seconds inside a rotating vial of resin. Here is what it does, how it works, what it costs, and what it means for makers, educators and product teams."
tags: ["3d-printing", "volumetric-3d-printing", "open-source", "maker", "additive-manufacturing", "education"]
featured: true
seoTitle: "OpenCAL: Open-Source Volumetric 3D Printer from UC Berkeley"
seoDescription: "UC Berkeley released OpenCAL, an open-source volumetric 3D printer you can build for $1,638. Formlabs makes the resin, Prusa sells it. What CAL does, how it works, and what it means for makers and educators."
canonical: "https://shamylmansoor.com/blog/opencal-open-source-volumetric-3d-printer-berkeley-formlabs-prusa/"
---

Volumetric 3D printing — a process that cures an entire object in seconds rather than building it layer by layer — has been confined to a handful of research labs since it was first demonstrated in 2019. That changes with OpenCAL, a build-it-yourself volumetric 3D printer released by researchers at the University of California, Berkeley on October 20, 2026. The printer uses Computed Axial Lithography (CAL) to form complete parts inside a rotating vial of photosensitive resin, with no layer lines, no support structures, and no moving print head. The bill of materials comes to approximately $1,638, assembly takes five to six hours, and every drawing, line of firmware code, and resin recipe is public. Formlabs manufactures the dedicated resin at production scale, and Prusa Research sells it through its US store. For makers, educators, and product teams, OpenCAL represents the most significant democratization of a fundamentally new 3D printing process since the RepRap project put filament printers on hobbyist workbenches.

## In Brief

- OpenCAL uses Computed Axial Lithography (CAL) to form entire objects in one step inside a rotating resin vial, typically in 90 seconds to 2 minutes
- The bill of materials is approximately $1,638 (June 2026 pricing); assembly takes 5–6 hours using a Raspberry Pi 5, consumer LED projector, and 3D printed parts
- Formlabs produces the dedicated OpenCAL Resin in 1 L bottles at $119.99, sold through Prusa's Printed Solid US store
- The hardware is released under Prusa's Open Community License (OCL 1.1); firmware and software are on GitHub
- CAL was invented in 2017 in Professor Hayden Taylor's lab at UC Berkeley and first published in Science in 2019; OpenCAL packages it into an accessible desktop format after nearly a decade of lab-only development
- Pilot deployments are already running at MIT, Purdue, Lawrence Livermore National Laboratory, and NIST, with a community Discord of over 2,200 members

## What Is Computed Axial Lithography?

Computed Axial Lithography, or CAL, is a volumetric 3D printing process that works on a principle similar to a CT scan in reverse. A CT scanner rotates around a patient, capturing X-ray projections from many angles and reconstructing a three-dimensional image. A CAL printer does the opposite: it computes a series of light projections from many angles, projects them into a rotating vial of photopolymer resin, and the resin solidifies wherever the accumulated light dose crosses a curing threshold.

The result is a complete, fully formed part produced in a single step. No layers. No support structures. No print head moving back and forth. The entire object exists simultaneously throughout the resin volume.

The process was invented in 2017 in Professor Hayden Taylor's lab at UC Berkeley's Department of Mechanical Engineering, in collaboration with Lawrence Livermore National Laboratory. The original paper, "Volumetric additive manufacturing via tomographic reconstruction," was published in Science in March 2019. For nearly a decade, CAL remained inside a small number of research labs. OpenCAL changes that by packaging the technology into a low-cost, open-source printer that anyone can build.

This matters because volumetric printing solves problems that layer-based 3D printing cannot. Layer-based processes — whether FDM, SLA, or DLP — build parts sequentially, which introduces layer lines, mechanical anisotropy, and production time that scales with part complexity. CAL produces parts with no layer lines at all, in time that depends on resin curing speed rather than part complexity. A simple sphere and an intricate lattice take roughly the same exposure time.

## How OpenCAL Works

OpenCAL V2 is built around three core components: a consumer LED projector, a Raspberry Pi 5, and a stepper-driven vial mount. These sit inside an aluminum extrusion frame with laser-cut acrylic panels and 3D printed PETG, PLA, and TPU parts. The entire machine is small enough to carry in a camera case.

The printing process works as follows:

1. **Model preparation:** A free Windows application called Tomo converts an STL file into a print sequence — a series of light projections computed using tomographic optimization. Tomo is built on VAMToolbox, an open-source Python library that solves the underlying mathematics.

2. **Printing:** The projector beams a rapidly changing sequence of computed light patterns into the rotating vial of photosensitive resin. The vial rotates continuously, and the resin solidifies wherever the accumulated light dose from all projection angles exceeds the curing threshold. The reference part in the OpenCAL documentation — a replica of Rodin's Thinker — forms in approximately 90 seconds.

3. **Post-processing:** The documentation includes washing and curing procedures. The uncured resin is drained, the part is washed in solvent, and a final UV cure hardens the surface.

The printer runs open firmware on the Raspberry Pi 5 and plays print files from a USB drive. All parameters are tunable through a configuration file. The firmware repository on GitHub has attracted 555 stars as of October 2026, indicating strong early community interest.

## What It Costs

| Component | Cost |
|-----------|------|
| OpenCAL hardware BOM (projector, Raspberry Pi 5, frame, electronics) | ~$1,638 |
| OpenCAL Resin (1 L, Formlabs) | $119.99 per bottle |
| 3D printed parts (PETG, PLA, TPU) | Self-printed on any FDM printer |
| Tomo software | Free |
| OpenCAL firmware | Free (open-source) |
| Total entry cost (printer + 1L resin) | ~$1,758 |

The $1,638 BOM is based on June 2026 component pricing. The 3D printed structural parts can be produced on any desktop FDM printer — the prototype parts were printed on a Prusa CORE One. For anyone who already owns a 3D printer and has basic electronics assembly experience, the incremental cost is the BOM components plus resin.

## How This Differs From Layer-Based 3D Printing

The distinction between CAL and conventional 3D printing is not incremental. It is a different physical process.

**Layer-based printing (FDM, SLA, DLP):** The printer builds the part one layer at a time. Each layer must be completed before the next begins. Production time scales with the number of layers, which scales with part height and inverse layer thickness. Layer lines are inherent to the process. Mechanical properties vary between the XY plane and the Z axis. Overhangs require support structures.

**Volumetric printing (CAL):** The entire part forms simultaneously. Production time depends on resin curing kinetics and projection dose, not on part complexity or height. There are no layer lines. Mechanical properties are isotropic — the same in all directions. Support structures are unnecessary because the part is suspended in liquid resin throughout the process.

The trade-off is part size and material range. CAL works best for small, optically transparent parts. Light penetration depth limits the maximum vial size, and opaque or highly scattering materials are difficult to use. The current OpenCAL build volume is determined by the vial dimensions, which are modest compared to desktop FDM or SLA printers.

## The Formlabs and Prusa Partnership

Two companies played critical roles in making OpenCAL accessible beyond Berkeley's lab.

**Formlabs** manufactures the dedicated OpenCAL Resin at production scale. Before this, anyone building a volumetric printer had to mix resin by hand from laboratory chemicals — one of the main barriers to entry. Formlabs produces the Berkeley-developed UDMA-based formulation in 1 L bottles, has committed to further production runs as demand grows, and the recipe remains published for labs that prefer to mix their own. Formlabs is the company behind the Form series of professional resin 3D printers, and its involvement signals that it sees volumetric printing as a technology worth supporting at the materials level.

**Prusa Research** sells the resin in the United States for $119.99 per bottle through Printed Solid, its US online store. Prusa also hosts every OpenCAL printable part on its Printables model community, and the hardware is released under Prusa's Open Community License (OCL 1.1), which guarantees the right to build, modify, repair, and share the design. Prusa's involvement is fitting: the company grew out of the RepRap movement that open-sourced filament 3D printing, and its [PrusaSlicer 3.0 release](/blog/prusaslicer-3-0-multi-bed-plugins-ui-rewrite/) demonstrated its continued investment in open-source 3D printing software. The OpenCAL partnership extends that philosophy to a fundamentally different printing technology.

Both companies helped bring earlier 3D printing technologies to the desktop. Prusa grew out of RepRap, which put filament printers on hobbyist workbenmarks. Formlabs moved stereolithography out of the service bureau and into offices and labs. Their involvement with OpenCAL suggests they see volumetric printing as the next frontier worth democratizing.

## Why This Matters for Educators

For STEAM educators, OpenCAL is a teaching tool that connects multiple disciplines in a single device:

- **Physics:** How tomographic light fields work, why photopolymerization thresholds matter, how optical absorption affects cure depth
- **Mathematics:** The tomographic reconstruction algorithms that compute projection patterns — the same mathematics behind medical CT imaging
- **Materials science:** Photopolymer resin chemistry, crosslinking behavior, and how formulation affects curing properties
- **Manufacturing engineering:** The shift from layer-based to volumetric processes and what it means for production speed and part quality
- **Computer science:** Open-source firmware development, Python-based optimization libraries, and the relationship between software and physical output

For schools and universities operating makerspaces, OpenCAL offers something else: a research-grade 3D printing technology at a price point comparable to a mid-range desktop FDM printer. The pilot program has already demonstrated that universities can use OpenCAL for capstone projects and classroom exercises, with machines running or under construction at MIT, Purdue, and institutions across North America, Europe, and Asia.

For Pakistani educators specifically, the relevance is twofold. First, the open-source nature means there are no licensing fees or proprietary lock-in — the technology is accessible to any institution willing to source the components. Second, the build-it-yourself aspect is itself a learning experience. Students who assemble an OpenCAL printer learn about optics, electronics, firmware, and mechanical assembly in a single project, mirroring the kind of [hands-on STEAM education](/work/learnosteam/) that product-building experience shows is most effective for developing real engineering capability.

## For Makers and the Open-Source Community

For the maker community, OpenCAL is significant because it opens a 3D printing process that was previously inaccessible. The community response has been immediate: the project's Discord server has over 2,200 members, and hobbyists have already printed parts on home-built machines. The GitHub firmware repository has 555 stars, and the hardware designs are available for anyone to download, modify, and improve.

This is the same pattern that drove the original RepRap movement: an open design, a community of contributors, and a technology that improves through collective iteration. Whether OpenCAL follows the same trajectory — from experimental build to polished consumer product — depends on how quickly the community can improve print quality, expand material options, and develop better software tools.

The honest assessment from the community includes a key limitation: print resolution does not yet match standard resin printers. A comment on the VoxelMatters article noted that current OpenCAL prints do not approach the detail of a cheap SLA printer, making it impractical for applications like miniature painting. This is early-stage technology, and the resolution will improve with community contributions and algorithm refinements. But anyone expecting OpenCAL to replace their resin printer for detailed miniatures today will be disappointed.

## For Product Teams

From a product-building perspective, OpenCAL is interesting for two reasons.

First, it demonstrates that volumetric printing has matured enough to leave the lab without being commercialized in the traditional sense. The path from lab to accessibility was not a startup raising venture capital and shipping a polished product. It was a university research group, two industry partners, and an open-source community. This model — academic research plus open-source release plus industry material support — may be a viable path for other deep-tech manufacturing technologies that are too niche for venture funding but too valuable to remain locked in labs.

Second, for product teams evaluating additive manufacturing for production, OpenCAL provides a low-cost way to experiment with volumetric printing. If your product involves small, complex parts where isotropic mechanical properties matter — medical devices, optical components, microfluidics — building an OpenCAL to test the process is a $1,758 experiment. That is dramatically cheaper than any commercial volumetric printing system.

The connection to broader 3D printing trends is also worth noting. The recent [IOT Light-Form commercial deployment](/blog/volumetric-3d-printed-progressive-lenses-iot-light-form/) demonstrated that volumetric printing can meet commercial quality standards in regulated consumer products. OpenCAL provides the experimental platform that could help product teams evaluate whether volumetric printing is viable for their own applications — before investing in industrial-scale equipment.

## What to Watch Next

- **Print quality improvements.** The current OpenCAL produces parts that are functional but not as detailed as standard resin printers. Community contributions to the Tomo software, projection algorithms, and resin formulations will drive improvements. Watch the GitHub repositories and Discord for algorithm updates.

- **Material expansion.** The dedicated OpenCAL Resin is a UDMA-based photopolymer optimized for volumetric curing. Formlabs has committed to further production runs, but the range of available materials will determine how widely OpenCAL is adopted. The recipe is published, so labs can develop their own formulations.

- **Scale-up efforts.** The current build volume is limited by vial size and light penetration depth. Larger vats, higher-power projectors, and multi-wavelength systems could expand the printable part size. Berkeley's SpaceCAL program has already demonstrated CAL in microgravity, which suggests the process is robust enough for non-standard environments.

- **University adoption.** Berkeley is hosting a one-day OpenCAL build workshop at VAM27@Berkeley in February 2027. The number of universities that adopt OpenCAL for teaching and research will indicate whether volumetric printing becomes a standard part of the 3D printing curriculum.

- **Commercial spin-offs.** If OpenCAL proves viable for specific applications — dental models, microfluidics, optical components — commercial volumetric printers built on the open-source foundation may follow. The IOT Light-Form example shows that commercial volumetric printing is possible; OpenCAL could accelerate it by providing a proven reference design.

## Product Builder's Perspective

For technology teams building products in Pakistan and similar emerging markets, OpenCAL is worth attention for a specific reason: it lowers the barrier to experimenting with a manufacturing process that was previously accessible only to well-funded research labs. The total cost of entry — under $1,800 — is within reach of university engineering departments, makerspaces, and hardware startups.

The open-source model also means there is no dependency on a single vendor for materials, software, or support. The resin recipe is published. The firmware is on GitHub. The hardware designs are freely available. For teams in markets where proprietary equipment is expensive to import and service, this is a meaningful advantage.

The limitation is print quality and build volume. OpenCAL is not going to replace an FDM printer for general-purpose fabrication, or a resin printer for detailed parts. What it offers is access to a fundamentally different physical process — one that eliminates layer lines, produces isotropic parts, and cures in seconds rather than minutes. For educators teaching manufacturing technology, researchers exploring new materials, or product teams evaluating additive manufacturing for specific applications, that access is the point.

For anyone who has built a [3D-printed robot kit](/work/codibot/) or worked with [desktop 3D printers](/blog/prusa-2026-lineup-refresh-xl-core-one-upgrades/) in an educational setting, OpenCAL offers a different kind of learning: not just using a printer, but understanding and building one from first principles. The assembly process itself — projector alignment, resin handling, firmware configuration — is an engineering exercise that connects optics, software, and manufacturing in a way that few other maker projects do.

## Conclusion

OpenCAL is not a product. It is an experiment in democratizing a deep-tech manufacturing process through open-source release, industry partnership, and community contribution. Whether it becomes a widely adopted tool or remains a niche research platform depends on how quickly the community improves print quality, expands material options, and develops practical applications.

What is clear is that volumetric 3D printing — a process that was demonstrated in a research lab in 2017 and commercialized in a single product category in 2026 — is now accessible to anyone willing to spend $1,638 and six hours of assembly time. For educators, that means a research-grade technology is available for classroom use. For makers, it means a new frontier of experimentation. For product teams, it means a low-cost way to evaluate a manufacturing process that may shape the next decade of additive manufacturing.

Are you building an OpenCAL, or considering volumetric 3D printing for your classroom or product team? The technology is young and the community is small — which means individual contributions matter more than they would in a mature ecosystem.

## Sources

- [VoxelMatters: UC Berkeley releases OpenCAL, an open-source volumetric 3D printer, with Formlabs and Prusa](https://www.voxelmatters.com/uc-berkeley-releases-opencal-an-open-source-volumetric-3d-printer-with-formlabs-and-prusa/) — published October 20, 2026
- [OpenCAL firmware repository (GitHub)](https://github.com/computed-axial-lithography/OpenCAL-Firmware) — computed-axial-lithography organization
- [Kelly et al., "Volumetric additive manufacturing via tomographic reconstruction," Science, Vol. 363, Issue 6431, pp. 1075-1079, March 8, 2019](https://doi.org/10.1126/science.aau7114)
- [OpenCAL Resin (Prusa / Printed Solid US store)](https://www.prusa3d.com/) — $119.99 per 1 L bottle
- [VoxelMatters: IOT and VisionLab bring the first volumetric 3D printed progressive lenses to consumers](https://www.voxelmatters.com/iot-and-visionlab-bring-the-first-volumetric-3d-printed-progressive-lenses-to-consumers/) — published October 7, 2026