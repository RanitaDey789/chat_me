---

title: C-DAC Research Internship
type: internship
organization: Centre for Development of Advanced Computing (C-DAC), Kolkata
duration: October 2024 – June 2025
role: R&D Intern – Information Security (Deep Learning)
domain:

* Deep Learning
* Information Security
* Computer Vision
* Steganalysis
* Artificial Intelligence
  related:
* publications.md
* skills.md
* projects/self_rag_bot.md
* projects/water_quality_analysis.md
  keywords:
* Steganalysis
* Steganography
* Deep Learning
* CNN
* SRNet
* XuNet
* YeNet
* JPEG
* F5
* JSTEG
* OutGuess
* Computer Vision

---

# C-DAC Research Internship

## Overview

During my final year of B.Tech, I had the opportunity to work as an **R&D Intern in Information Security** at the **Centre for Development of Advanced Computing (C-DAC), Kolkata**, from **October 2024 to June 2025**.

This internship was one of the most significant milestones in my academic and professional journey because it introduced me to research-oriented software development. Unlike classroom projects that mainly focus on implementation, this internship emphasized understanding existing research, identifying limitations, proposing improvements, conducting experiments, and validating results scientifically.

My research specialization was **Deep Learning-based Universal Image Steganalysis**, where I worked on adapting state-of-the-art convolutional neural network architectures for detecting hidden information inside JPEG color images.

This internship strengthened my understanding of Artificial Intelligence, Deep Learning, Information Security, Computer Vision, dataset engineering, experimentation, and scientific research.

---

# About C-DAC

The **Centre for Development of Advanced Computing (C-DAC)** is one of India's premier research and development organizations under the Ministry of Electronics and Information Technology (MeitY).

C-DAC works in various advanced technology domains including:

* Artificial Intelligence
* High Performance Computing
* Cyber Security
* Quantum Computing
* Embedded Systems
* Healthcare Informatics
* Language Computing
* Information Security

Working at C-DAC exposed me to a research environment where experimentation, documentation, and continuous improvement were considered equally important as software development itself.

---

# Internship Details

**Organization**

Centre for Development of Advanced Computing (C-DAC), Kolkata

**Duration**

October 2024 – June 2025

**Department**

Research & Development

**Specialization**

Information Security using Deep Learning

**Research Area**

Universal Image Steganalysis

---

# Objective of the Internship

The primary objective of my internship was to explore how Deep Learning could improve **Universal Image Steganalysis**.

Traditional steganalysis methods often depend on handcrafted statistical features and require prior knowledge about the embedding technique. As steganography tools continue to evolve, manually engineered detection methods become increasingly difficult to maintain.

The research therefore focused on building generalized deep learning models capable of detecting hidden information automatically by learning discriminative features directly from image data.

Rather than targeting a single embedding algorithm, the goal was to develop models that perform well across multiple JPEG steganography techniques.

---

# Background

Before starting the project, I spent considerable time understanding the fundamentals of:

* Digital Image Processing
* JPEG Compression
* Information Security
* Convolutional Neural Networks
* Feature Extraction
* Residual Learning
* High-pass Filtering
* Image Noise Analysis
* Existing Steganography Techniques

A significant part of research involves understanding previous work before proposing improvements. Therefore, I studied several published research papers on image steganalysis before beginning implementation.

---

# What is Digital Steganography?

Digital steganography is the process of hiding confidential information inside another digital medium in such a way that the existence of the hidden message is extremely difficult to detect.

Unlike cryptography, which hides the content of a message, steganography attempts to hide the very existence of the message.

Typically:

* A normal image is called the **Cover Image**.
* The secret message is embedded inside the cover image.
* The resulting image is called the **Stego Image**.

Ideally, the visual difference between the cover image and the stego image should be almost impossible for humans to notice.

Because only a small number of pixels or compressed coefficients are modified, stego images appear visually identical to the original image.

This property makes steganography useful for secure communication but also creates challenges for digital forensics and cybersecurity.

---

# Why is Steganography Important?

Steganography has many legitimate applications, including:

* Secure communication
* Digital watermarking
* Copyright protection
* Military communication
* Confidential document transmission

However, it can also be misused for:

* Secret communication between attackers
* Malware communication
* Data exfiltration
* Terrorist communication
* Cybercrime

Because of these security implications, detecting hidden information becomes an important research problem.

---

# What is Steganalysis?

Steganalysis is the process of determining whether an image contains hidden information.

Unlike steganography, which attempts to hide messages, steganalysis attempts to detect their existence.

The objective is not necessarily to recover the hidden message.

Instead, the goal is to answer:

> "Does this image contain hidden data?"

Steganalysis plays an important role in cybersecurity, digital forensics, and intelligence gathering.

---

# Types of Steganalysis

## Specific Steganalysis

Specific steganalysis focuses on detecting one particular embedding technique.

Advantages:

* High accuracy for known methods

Disadvantages:

* Requires prior knowledge
* Difficult to generalize
* New embedding techniques can easily bypass detection

---

## Universal Steganalysis

Universal steganalysis attempts to detect hidden information without prior knowledge of the embedding algorithm.

Instead of learning signatures for one technique, the model learns subtle statistical differences between normal and stego images.

Universal steganalysis is significantly more challenging but far more practical in real-world applications because investigators often do not know which steganography algorithm was used.

This research focused on Universal Steganalysis.

---

# Why Deep Learning?

Traditional steganalysis methods relied heavily on manually engineered statistical features.

These handcrafted approaches have several limitations:

* Depend on expert knowledge
* Difficult to extend
* Poor generalization
* Sensitive to new embedding techniques

Deep Learning addresses these limitations by allowing neural networks to learn relevant features automatically from data.

Instead of manually designing feature extractors, convolutional neural networks learn hierarchical image representations during training.

This makes them more adaptable to unseen steganography methods.

---

# Why Universal Deep Learning-Based Steganalysis?

The motivation behind this research was simple.

Most existing research focused on grayscale PGM images.

However, real-world users rarely hide information inside grayscale PGM files.

Most publicly available steganography software works with JPEG color images.

Therefore, a model trained only on grayscale datasets has limited practical usefulness.

The objective of this internship was to bridge this gap by adapting existing deep learning models to work effectively with JPEG color images.

---

# Existing Research Datasets

While reviewing previous literature, we found that two datasets were widely used for steganalysis research.

## BOSSbase

BOSSbase contains approximately 10,000 grayscale cover-stego image pairs.

It has been widely used for benchmarking deep learning steganalysis models.

---

## BOWS2

BOWS2 is another popular grayscale image dataset used extensively in academic steganalysis research.

Like BOSSbase, it primarily contains grayscale PGM images.

---

# Limitations of Existing Datasets

Although these datasets are excellent for benchmarking algorithms, they do not accurately represent real-world usage.

Major limitations included:

* Grayscale images only
* PGM image format
* Limited diversity
* Not representative of modern image sharing platforms

Since most users exchange JPEG color images through messaging applications and social media, we believed a JPEG-based dataset would improve real-world applicability.

---

# Dataset Creation

One of the biggest contributions of our work was creating a new dataset specifically for JPEG steganalysis.

Instead of relying solely on existing academic datasets, we built our own dataset using publicly available images.

The process involved multiple stages.

---

## Step 1 – Collecting Images

Images were downloaded from publicly available datasets available on Kaggle.

The objective was to gather diverse natural images suitable for steganographic embedding.

---

## Step 2 – Creating Multiple Datasets

Two independent datasets were prepared.

### Dataset A

Resolution:

512 × 512

Total Images:

20,778 JPEG images

---

### Dataset B

Resolution:

256 × 256

Total Images:

12,000 JPEG images

Creating datasets with multiple resolutions allowed us to study how image size affects steganalysis performance.

---

## Step 3 – JPEG Quality Adjustment

All images were converted to JPEG format using a quality factor of **75%**.

Maintaining a consistent quality factor reduced variability during experimentation while also reflecting common real-world JPEG compression settings.

---

## Step 4 – Generating Stego Images

After preparing the cover images, multiple JPEG steganography tools were used to generate corresponding stego images.

The embedding techniques included:

* JSTEG
* F5
* OutGuess

Each cover image therefore had an associated stego version for supervised learning.

---

## Step 5 – Dataset Organization

The dataset was divided into:

* Training Set
* Validation Set
* Testing Set

This ensured that model evaluation was performed on unseen data and reduced the risk of overfitting.

---

# Why This Dataset Was Important

Creating our own JPEG dataset addressed one of the biggest limitations in previous research.

Instead of evaluating models only on grayscale academic datasets, we trained them using JPEG color images that better resemble real-world scenarios.

This made the research more practical and increased the potential for deployment in digital forensic applications.

---
# Steganography Techniques Used

To evaluate the robustness of the deep learning models, we selected three widely used JPEG steganography algorithms. These algorithms differ in the way they embed hidden information inside an image, allowing us to study how different embedding strategies influence detection accuracy.

Using multiple embedding techniques also helped improve the generalization capability of the steganalysis models.

---

## JSTEG

JSTEG is one of the earliest JPEG-based steganographic algorithms.

Instead of modifying pixels directly, it works on the **Discrete Cosine Transform (DCT) coefficients** generated during JPEG compression.

### Working Principle

1. The image is compressed using JPEG.
2. The DCT coefficients are scanned in a zig-zag order.
3. The Least Significant Bit (LSB) of non-zero coefficients is modified to embed the secret message.
4. The modified coefficients are recompressed to generate the stego image.

### Advantages

* Simple implementation
* Low computational complexity
* Suitable for educational purposes

### Limitations

* Easily detectable using modern steganalysis methods.
* Leaves statistical artifacts in JPEG coefficients.
* Less secure than modern embedding techniques.

---

## OutGuess

OutGuess is a more advanced JPEG steganography algorithm.

Instead of simply modifying coefficients, it attempts to preserve the statistical properties of the original image after embedding.

This makes it significantly harder to detect using traditional statistical steganalysis methods.

### Advantages

* Better image quality preservation
* Harder to detect
* Maintains first-order statistics

### Limitations

* Still vulnerable to modern deep learning models
* More computationally expensive than JSTEG

---

## F5

F5 is considered one of the most effective classical JPEG steganography techniques.

Instead of directly replacing bits, it uses **matrix encoding** and coefficient shrinking to reduce the number of modifications required.

As fewer coefficients are altered, visual distortion becomes extremely small.

### Advantages

* Very small embedding distortion
* Better embedding efficiency
* More resistant to traditional statistical analysis

### Challenges

Although F5 is significantly harder to detect than JSTEG, deep learning models are capable of learning subtle embedding artifacts when trained on sufficiently large datasets.

---

# Why Multiple Embedding Algorithms?

Real-world forensic systems cannot assume that every attacker uses the same embedding algorithm.

Training on only one technique would create a biased model.

Therefore, our experiments included:

* JSTEG
* F5
* OutGuess

This improved the robustness and practical applicability of the developed models.

---

# Deep Learning Models Evaluated

After reviewing the existing literature, we selected three state-of-the-art convolutional neural network architectures specifically designed for image steganalysis.

Each architecture represents a different design philosophy for detecting hidden information.

The models evaluated were:

* XuNet
* YeNet
* SRNet

Each model was trained independently and compared using identical experimental conditions wherever possible.

---

# XuNet

## Overview

XuNet is one of the earliest successful deep learning architectures specifically developed for image steganalysis.

Although relatively simple compared to modern architectures, it demonstrated impressive performance for detecting hidden information.

Its simplicity also makes it computationally efficient.

---

## Architecture

XuNet is a Convolutional Neural Network consisting of:

* High-pass filtering
* Convolution layers
* Activation layers
* Pooling layers
* Fully connected classifier

Unlike conventional image classification networks, XuNet attempts to suppress image content while emphasizing weak steganographic signals.

---

## High-Pass Filtering

The first layer uses a **KV high-pass filter**.

Instead of learning from the original image directly, the filter removes most image content while amplifying residual noise where hidden information may exist.

This preprocessing step significantly improves the ability of later convolution layers to identify embedding artifacts.

---

## Advantages

* Lightweight architecture
* Fast training
* Good detection accuracy
* Easy to implement

---

## Limitations

During experimentation, XuNet showed:

* High accuracy
* Fast convergence
* Noticeable instability during training

Training curves fluctuated more than expected, indicating sensitivity to initialization and hyperparameters.

Despite this instability, XuNet consistently produced competitive results.

---

# XuNet Experimental Results

Batch Size:

16

### Dataset: 512 × 512 (20,778 Images)

**F5**

Learning Rate:

5e-5 → 1e-4

Test Accuracy:

98.77%

Test Loss:

0.0387

---

**OutGuess**

Learning Rate:

2e-4 → 1e-5

Test Accuracy:

95.48%

Test Loss:

0.1240

---

### Dataset: 256 × 256 (12,000 Images)

**JSTEG**

Accuracy:

82.44%

Loss:

0.3570

---

**F5**

Accuracy:

98.96%

Loss:

0.0332

---

**OutGuess**

Accuracy:

98.25%

Loss:

0.0413

---

## Observations

The results showed that XuNet performs exceptionally well for F5 and OutGuess but struggles comparatively with JSTEG on lower-resolution datasets.

This suggests that both image resolution and embedding strategy significantly influence detection performance.

Overall, XuNet achieved high accuracy while maintaining relatively low computational complexity.

---

# YeNet

## Overview

YeNet is another CNN architecture designed specifically for image steganalysis.

Unlike XuNet, YeNet uses predefined high-pass filters in its first layer to emphasize stego noise before feature extraction begins.

The model focuses heavily on preserving weak residual information.

---

## Architecture

Main components include:

* Predefined high-pass filters
* Convolution layers
* Batch normalization
* Non-linear activation
* Pooling
* Fully connected classifier

Compared to XuNet, YeNet demonstrated more stable optimization during training.

---

## Advantages

* Stable learning
* Better convergence
* Strong performance on difficult datasets
* Good generalization

---

## Limitations

The primary drawback observed during experimentation was that YeNet required a much larger number of training epochs before achieving competitive accuracy.

Training therefore consumed significantly more computational resources.

---

# YeNet Experimental Results

Batch Size:

16

### Dataset: 512 × 512

OutGuess

Learning Rate:

1e-5

Accuracy:

87.99%

Loss:

0.2861

---

### Dataset: 256 × 256

JSTEG

The model failed to learn effectively.

Accuracy remained close to:

50%

Loss remained approximately:

0.69

throughout training.

This indicates that the network was unable to distinguish cover and stego images under this configuration.

---

F5

Learning Rate:

1e-5

Accuracy:

99.58%

Loss:

0.0167

---

OutGuess

Learning Rate:

2e-4

Accuracy:

96.83%

Loss:

0.0748

---

## Observations

YeNet exhibited:

* Extremely stable optimization
* Excellent performance on F5
* Moderate performance on OutGuess
* Failure under one JSTEG configuration

Despite requiring longer training, the architecture demonstrated impressive robustness.

---

# SRNet

## Overview

SRNet represents one of the most advanced CNN architectures for image steganalysis.

Unlike earlier models that relied heavily on handcrafted preprocessing filters, SRNet allows the network to learn useful residual representations directly.

This makes the architecture more flexible and capable of learning subtle embedding artifacts.

---

## Residual Learning

SRNet employs multiple residual blocks inspired by modern deep residual networks.

Residual learning enables the network to:

* Train deeper architectures
* Reduce vanishing gradients
* Improve feature reuse
* Learn complex image representations

Because hidden information introduces extremely small perturbations, deeper feature extraction becomes particularly valuable.

---

## Weight Initialization

Instead of predefined handcrafted filters, SRNet utilizes **He Initialization** for learning the initial convolution weights.

This allows the network to discover optimal feature representations directly from data rather than depending on manually designed preprocessing filters.

---

## Advantages

* Highest learning capability
* Strong feature extraction
* Excellent accuracy
* Better adaptability to unseen data

---

## Limitations

The main disadvantage observed during experimentation was computational cost.

Training SRNet required significantly more time compared to XuNet and YeNet because of its deeper architecture.

However, the additional computational expense resulted in improved detection capability.

---

# Adapting Existing Models for JPEG Images

One of the major contributions of this internship was adapting existing grayscale steganalysis models to work effectively with JPEG color images.

Most published research focused on grayscale PGM datasets.

However, this does not reflect real-world image sharing, where JPEG color images are overwhelmingly more common.

To address this limitation, the network architectures were modified to process JPEG images.

---

## Three-Channel Input Adaptation

Grayscale images contain only a single channel.

JPEG color images contain:

* Red
* Green
* Blue

Therefore, the input layer of the selected CNN architectures was modified to accept **three-channel RGB images** instead of single-channel grayscale inputs.

This adaptation enabled the networks to learn embedding artifacts from color images while preserving compatibility with existing architectures.

Interestingly, experiments suggested that using three-channel inputs helped the models learn richer representations and improved convergence in several cases.

---

# Contribution to Existing Research

The internship extended previous research in several important ways.

### JPEG-Based Training

Instead of relying on grayscale datasets, the models were trained using JPEG color images, making the experiments more representative of practical forensic scenarios.

---

### Larger Dataset

Two new datasets containing:

* 20,778 images
* 12,000 images

were prepared specifically for this work.

---

### Modern JPEG Embedding Algorithms

Rather than evaluating only older grayscale embedding methods such as S-UNIWARD, HILL, or HUGO commonly found in literature, this research focused on widely used JPEG embedding techniques:

* JSTEG
* F5
* OutGuess

This increased the practical relevance of the study.

---
# Experimental Setup

To ensure that the comparison between different deep learning models was fair, the experiments were performed using a consistent training pipeline wherever possible.

The objective was to evaluate how each architecture behaved under different embedding techniques and image resolutions rather than optimizing each model independently.

---

## Data Preparation

Before training, all datasets underwent preprocessing.

The workflow consisted of:

1. Downloading publicly available images.
2. Converting images to JPEG format.
3. Setting JPEG Quality Factor to 75%.
4. Generating stego images using multiple embedding algorithms.
5. Pairing every cover image with its corresponding stego image.
6. Splitting the dataset into training, validation, and testing subsets.

This ensured that every model was evaluated on previously unseen images.

---

## Training Configuration

Throughout the experiments, similar training configurations were maintained whenever possible.

Typical settings included:

* Batch Size: **16**
* JPEG Quality Factor: **75**
* Cover-Stego Pair Training
* Separate Validation Dataset
* Independent Test Dataset

Different learning rates were explored depending on the architecture and embedding algorithm because each model converged differently.

---

# Performance Comparison

One of the objectives of this internship was not only to build models but also to compare different architectures and understand their strengths and weaknesses.

Each model demonstrated unique characteristics.

---

## XuNet

### Strengths

* Fast convergence
* High accuracy
* Lightweight architecture
* Easier to train

### Weaknesses

* Training instability
* Sensitive to hyperparameters
* Performance varied across datasets

XuNet produced excellent results for F5 and OutGuess while showing comparatively lower performance on lower-resolution JSTEG datasets.

---

## YeNet

### Strengths

* Very stable optimization
* Strong convergence
* Excellent F5 detection

### Weaknesses

* Required significantly more training epochs
* Computationally expensive
* Failed under one JSTEG configuration

YeNet demonstrated that stability alone does not always guarantee success across every embedding algorithm.

---

## SRNet

### Strengths

* Deep residual architecture
* Learns highly discriminative features
* Excellent overall accuracy
* Better representation learning

### Weaknesses

* Long training time
* Higher computational requirements
* Increased GPU memory usage

Although SRNet required substantially longer training, it consistently showed promising results from the early stages of optimization.

---

# Overall Findings

Several important observations emerged from the experiments.

## 1. Image Resolution Matters

Higher resolution images generally produced better detection accuracy.

Larger images preserve more information, allowing convolutional neural networks to identify subtle embedding artifacts more effectively.

However, larger images also increase:

* GPU memory consumption
* Training time
* Computational cost

---

## 2. Dataset Quality Matters

The quality and diversity of the dataset had a significant impact on model performance.

Rather than relying on grayscale benchmark datasets, using realistic JPEG images improved the practical relevance of the research.

This reinforced an important lesson:

> Better datasets often improve performance more than changing the model architecture.

---

## 3. Different Embedding Algorithms Produce Different Challenges

The experiments demonstrated that no embedding algorithm behaves identically.

For example:

* F5 was consistently detected with very high accuracy.
* OutGuess required stronger feature extraction.
* JSTEG proved difficult under certain conditions, particularly with lower-resolution images.

This highlighted the importance of evaluating multiple embedding techniques rather than relying on a single benchmark.

---

## 4. Deep Learning Learns Better Feature Representations

Traditional steganalysis depends heavily on manually engineered statistical features.

Deep learning models, however, automatically learn discriminative representations directly from image data.

This ability to discover hidden patterns makes deep learning particularly effective for universal steganalysis.

---

# Challenges Faced

Like most research projects, this internship involved numerous technical and practical challenges.

---

## Large Dataset Processing

Training on tens of thousands of high-resolution images required considerable computational resources.

Preparing datasets, loading images, and training multiple deep learning models consumed significant time.

---

## High Computational Cost

Deep convolutional neural networks require substantial GPU resources.

Long training sessions meant that experimentation was slower than conventional machine learning projects.

---

## Model Complexity

Each architecture behaved differently.

Finding suitable learning rates, convergence behavior, and training stability required repeated experimentation.

Some models converged quickly, while others required many more epochs before producing meaningful results.

---

## Dataset Preparation

Collecting high-quality JPEG images was more challenging than expected.

The dataset needed to satisfy several requirements:

* Balanced classes
* Appropriate image quality
* Suitable resolutions
* Diverse image content

Preparing such a dataset required careful filtering and preprocessing.

---

## Research-Oriented Development

Unlike application development, research rarely has a predefined solution.

Many experiments produced unexpected results.

Several configurations had to be modified repeatedly before obtaining meaningful performance.

This taught me patience and systematic experimentation.

---

# Skills Developed During the Internship

This internship significantly strengthened both my technical and research abilities.

## Technical Skills

* Deep Learning
* Computer Vision
* CNN Architectures
* Image Processing
* Information Security
* Dataset Engineering
* Performance Evaluation
* Experimental Design

---

## Programming Skills

Throughout the internship I improved my ability to work with:

* Python
* Deep Learning Frameworks
* Scientific Computing
* Image Processing Libraries

---

## Research Skills

Perhaps the biggest improvement was learning how research differs from software development.

I learned how to:

* Read academic papers
* Compare existing approaches
* Identify research gaps
* Design experiments
* Analyze results
* Draw conclusions based on evidence

---

# Personal Learnings

Beyond technical knowledge, this internship changed the way I approach engineering problems.

I realized that building a model is only a small part of the process.

Understanding the problem, collecting quality data, designing meaningful experiments, interpreting failures, and documenting results are equally important.

The internship also taught me that negative experimental results are valuable because they help explain why certain approaches succeed while others fail.

---

# How This Internship Influenced My Career

Before joining C-DAC, my primary interest was software development.

Working on deep learning research exposed me to an entirely different perspective.

Instead of simply building applications, I became interested in understanding algorithms, improving existing techniques, and solving open research problems.

This experience strengthened my interest in:

* Artificial Intelligence
* Machine Learning
* Deep Learning
* Computer Vision
* Intelligent Systems
* Research-driven Software Engineering

It also inspired many of my later projects involving machine learning and AI.

---

# Future Improvements

If I continued this research, I would explore several directions.

These include:

* Fine-tuning the existing architectures.
* Evaluating Vision Transformer (ViT) based models.
* Training on even larger JPEG datasets.
* Testing additional embedding techniques.
* Investigating ensemble learning for improved robustness.
* Optimizing computational efficiency.
* Evaluating robustness under image compression and resizing.

---

# Key Takeaways

This internship taught me that successful AI systems depend on far more than choosing a powerful neural network.

The quality of data, careful experimentation, thoughtful evaluation, and continuous refinement all contribute significantly to the final performance.

More importantly, it strengthened my confidence in working on complex research-oriented problems that require both engineering and analytical thinking.

---

# Frequently Asked Recruiter Questions

## What was your role at C-DAC?

I worked as an R&D Intern specializing in Deep Learning-based Universal Image Steganalysis, focusing on adapting and evaluating state-of-the-art CNN architectures for JPEG color images.

---

## Why did you choose this project?

Steganalysis combines Artificial Intelligence, Information Security, and Computer Vision, making it an excellent research problem that required both theoretical understanding and practical implementation.

---

## Why wasn't the existing research sufficient?

Most previous work focused on grayscale PGM datasets that do not accurately represent real-world image sharing. We wanted to make the research more practical by using JPEG color images.

---

## Why Deep Learning instead of traditional methods?

Deep learning automatically learns discriminative image features and generalizes better than handcrafted statistical approaches.

---

## Which model performed best?

Each model had different strengths.

XuNet trained quickly and achieved high accuracy, YeNet provided stable optimization but required more epochs, while SRNet delivered strong performance through deeper residual learning at the cost of increased training time.

---

## What was the biggest challenge?

Preparing realistic datasets and training deep neural networks on large image collections while balancing computational cost and model performance.

---

## What did you learn?

I learned not only deep learning techniques but also how to conduct structured research, evaluate experimental results, identify limitations, and continuously improve a solution based on evidence.

---

## If you continued this project, what would you do?

I would investigate transformer-based architectures, larger datasets, ensemble models, and additional JPEG embedding techniques to improve generalization further.

---

# Final Reflection

Looking back, this internship was one of the most valuable learning experiences of my academic journey.

It gave me practical exposure to research methodology, advanced deep learning architectures, scientific experimentation, and technical problem-solving.

More importantly, it reinforced my belief that continuous learning, curiosity, and experimentation are essential qualities for building intelligent software systems.

The knowledge and confidence gained during this internship continue to influence the way I approach software development, machine learning, and research today.
