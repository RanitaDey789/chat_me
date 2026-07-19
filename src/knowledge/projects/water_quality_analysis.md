# Water Quality Analysis using Machine Learning

## Project Summary

**Project Type:** Machine Learning | Data Science | Flask Web Application

**Duration:** Final Year B.Tech Project (2024–2025)

**Role:** Machine Learning Engineer & Full Stack Developer (Team Project)

**Technologies**

- Python
- Flask
- Scikit-Learn
- Pandas
- NumPy
- Matplotlib
- HTML
- CSS
- Bootstrap
- SQLite
- Joblib
- Pickle

---

# Elevator Pitch

Water quality directly impacts public health, agriculture, industrial production, and environmental sustainability. Traditional laboratory testing methods are accurate but often require significant time, manpower, and cost.

The objective of this project was to build a machine learning system capable of predicting whether a water sample is safe for drinking based on important physicochemical and biological parameters.

Instead of relying entirely on manual laboratory interpretation, the system uses historical water quality data to recognize patterns associated with drinkable and non-drinkable water.

The final solution consists of a trained machine learning model deployed through a Flask web application where users can enter water quality parameters, receive an instant prediction, visualize the results, and download a PDF report.

Rather than being just another machine learning notebook, the project demonstrates the complete lifecycle of an AI application—from data collection and preprocessing to model training, evaluation, deployment, and user interaction. :contentReference[oaicite:0]{index=0}

---

# Why I Chose This Project

During my final year, I wanted to work on a project that solved a real-world problem instead of building another CRUD application.

Water quality affects millions of people every day. Contaminated water contributes to diseases such as cholera, typhoid, and dysentery, while also impacting agriculture, aquatic ecosystems, and industrial operations.

I realized that machine learning could help automate part of the water quality assessment process by learning patterns from historical measurements.

This project also aligned perfectly with my growing interest in Artificial Intelligence and Machine Learning.

It allowed me to combine several areas I wanted to strengthen:

- Data preprocessing
- Exploratory Data Analysis
- Machine Learning
- Ensemble Learning
- Model Evaluation
- Web Development
- Model Deployment

Unlike classroom assignments, this project required solving practical engineering problems such as handling missing values, deploying trained models, encoding categorical variables, maintaining preprocessing consistency between training and inference, and building an interface suitable for end users.

---

# Problem Statement

Water quality assessment traditionally depends on laboratory analysis performed by trained personnel.

Although these methods are reliable, they have several limitations:

- Time-consuming
- Costly
- Difficult to scale
- Limited automation
- Not suitable for immediate prediction

Large environmental datasets also make manual analysis increasingly difficult.

The goal of this project was therefore to develop an intelligent prediction system capable of analyzing multiple water quality parameters simultaneously and determining whether water is suitable for drinking.

The system was designed to reduce manual effort while providing fast, data-driven predictions that could assist environmental monitoring and decision making. :contentReference[oaicite:1]{index=1}

---

# Objectives

The project was designed around several objectives.

## Primary Objective

Develop a machine learning model capable of accurately classifying water as drinkable or non-drinkable using multiple water quality indicators.

---

## Secondary Objectives

- Build a clean and reliable dataset.
- Perform comprehensive preprocessing.
- Compare multiple machine learning algorithms.
- Improve prediction accuracy through ensemble learning.
- Deploy the model using Flask.
- Provide an easy-to-use web interface.
- Allow users to visualize prediction results.
- Generate downloadable prediction reports.

Beyond simply achieving high accuracy, the project focused on creating a complete end-to-end machine learning application. :contentReference[oaicite:2]{index=2}

---

# Real-World Importance

Water quality influences many critical sectors.

## Public Health

Unsafe drinking water causes numerous waterborne diseases.

An automated prediction system can assist authorities in identifying potentially unsafe water sources more quickly.

---

## Agriculture

Crop irrigation depends heavily on water quality.

Poor water quality can reduce crop productivity and contaminate soil.

---

## Environment

Aquatic ecosystems rely on stable chemical and biological conditions.

Monitoring parameters such as dissolved oxygen and biological oxygen demand helps identify pollution before severe ecological damage occurs.

---

## Industry

Many manufacturing processes require water within acceptable quality limits.

Rapid quality assessment can improve operational efficiency and reduce risk.

---

# Project Scope

The scope of the project includes:

- Collecting water quality datasets.
- Cleaning inconsistent data.
- Handling missing values.
- Performing feature engineering.
- Training multiple machine learning models.
- Comparing algorithm performance.
- Creating an ensemble model.
- Deploying the final model using Flask.
- Providing predictions through an interactive web interface.
- Supporting downloadable prediction reports.

The project demonstrates the complete workflow of an applied machine learning system rather than focusing solely on model development. :contentReference[oaicite:3]{index=3}

---

# My Contributions

Although this was a team project, I worked extensively on both the machine learning pipeline and the deployment of the application.

My major contributions included:

- Dataset preprocessing
- Missing value handling
- Feature encoding
- Model experimentation
- Ensemble model implementation
- Flask backend development
- Prediction pipeline
- User interface improvements
- Model serialization
- Debugging deployment issues
- PDF report generation
- End-to-end testing

One of the most valuable aspects of this project was that I experienced the transition from a notebook-based machine learning model to a usable web application.

---

# High-Level System Architecture

The overall workflow follows a standard machine learning pipeline.

```
Dataset
        │
        ▼
Data Cleaning
        │
        ▼
Missing Value Handling
        │
        ▼
Feature Engineering
        │
        ▼
Train-Test Split
        │
        ▼
Model Training
        │
        ▼
Model Evaluation
        │
        ▼
Voting Classifier
        │
        ▼
Save Model
        │
        ▼
Flask Application
        │
        ▼
User Prediction
        │
        ▼
Result + Visualization + PDF
```

Each stage depends on the successful completion of the previous one, making preprocessing just as important as the machine learning algorithms themselves.

---

# Technology Stack

## Programming

- Python

---

## Machine Learning

- Scikit-Learn
- NumPy
- Pandas

---

## Visualization

- Matplotlib

---

## Backend

- Flask

---

## Frontend

- HTML
- CSS
- Bootstrap

---

## Storage

- CSV Dataset
- SQLite Database

---

## Model Persistence

- Joblib
- Pickle

---

## Development Environment

- Google Colab
- Visual Studio Code

---

# What Makes This Project Different?

Many student machine learning projects stop after training a model inside a Jupyter Notebook.

I wanted this project to resemble a real software product.

Instead of stopping at model evaluation, I continued by:

- building a Flask web application,
- designing a user-friendly interface,
- adding parameter explanations,
- generating downloadable reports,
- storing prediction data,
- visualizing user inputs,
- and making the prediction process interactive.

This transformed the project from a proof of concept into an end-to-end machine learning application that demonstrates both AI and software engineering skills.

---

# Recruiter Questions

## What problem does this project solve?

It predicts whether a water sample is safe for drinking based on multiple measured parameters, reducing the time required for manual assessment and providing instant predictions.

---

## Why did you build this project?

I wanted to solve a meaningful real-world problem while learning the complete lifecycle of a machine learning application, including deployment.

---

## What did you learn?

Beyond machine learning, I learned that preprocessing, feature engineering, deployment, debugging, and user experience are equally important components of a successful AI system.

---

## Keywords

Machine Learning, Flask, Water Quality Analysis, Ensemble Learning, Gradient Boosting, Random Forest, Support Vector Machine, Logistic Regression, Data Cleaning, Feature Engineering, One-Hot Encoding, StandardScaler, Classification, Scikit-Learn, Python, Bootstrap, SQLite, Model Deployment, Data Visualization, Environmental AI.

# Dataset

## Overview

Every machine learning project begins with data, and in my opinion, the quality of the dataset often has a greater impact on the final model than the choice of algorithm.

For this project, we used a publicly available dataset containing water quality measurements collected from multiple monitoring stations across India. The dataset includes physical, chemical, and biological characteristics of water samples that collectively determine whether the water is safe for drinking.

Rather than relying on a single parameter such as pH, the model learns relationships among multiple features simultaneously. This makes the prediction more robust because water quality depends on the interaction of several environmental factors rather than one isolated measurement.

The dataset serves as the foundation of the entire machine learning pipeline. Every preprocessing step, feature engineering decision, and model evaluation ultimately depends on the reliability of this data. :contentReference[oaicite:0]{index=0}

---

# Dataset Size

The dataset contained approximately **1,362 water samples**, each representing measurements collected from different locations.

Each record consisted of several numerical water quality parameters along with a target label indicating whether the water was suitable for drinking.

Although this dataset is relatively small compared to industrial-scale machine learning datasets, it was sufficiently diverse for experimenting with multiple supervised learning algorithms.

---

# Dataset Features

The dataset includes the following parameters.

| Feature | Description |
|----------|-------------|
| Temperature | Temperature of the water sample |
| Dissolved Oxygen (DO) | Oxygen dissolved in water |
| pH | Acidity or alkalinity |
| Conductivity | Ability of water to conduct electricity |
| Biological Oxygen Demand (BOD) | Oxygen required for decomposition of organic matter |
| Nitrate | Nitrogen concentration |
| Fecal Coliform | Indicator of fecal contamination |
| Total Coliform | Total bacterial contamination |
| State | Geographic location |
| Latitude | Geographic coordinate |
| Longitude | Geographic coordinate |
| Class | Target label (Drinkable / Not Drinkable) |

These parameters represent different aspects of water quality and together provide sufficient information for machine learning models to distinguish between potable and non-potable water.

---

# Understanding Each Parameter

## Temperature

Water temperature directly affects chemical reactions and biological activity.

Higher temperatures reduce dissolved oxygen levels and increase bacterial growth.

Although temperature alone cannot determine potability, it significantly influences several other water quality indicators.

---

## Dissolved Oxygen (DO)

Dissolved Oxygen measures the amount of oxygen available in water.

Healthy aquatic ecosystems generally require higher dissolved oxygen concentrations.

Very low DO often indicates pollution caused by organic waste.

Since polluted water consumes oxygen during decomposition, dissolved oxygen becomes an important indirect indicator of contamination.

---

## pH

pH measures how acidic or alkaline water is.

Pure water has a pH close to 7.

Most drinking water standards recommend a pH between approximately 6.5 and 8.5.

Water outside this range may indicate contamination or excessive chemical content.

---

## Conductivity

Conductivity represents the ability of water to conduct electricity.

This depends primarily on the concentration of dissolved ions.

High conductivity often suggests elevated concentrations of dissolved salts or chemicals.

Although conductivity alone does not determine potability, it provides valuable information regarding mineral content.

---

## Biological Oxygen Demand (BOD)

BOD measures the amount of oxygen microorganisms require to decompose organic matter.

Higher BOD generally indicates greater organic pollution.

Water with extremely high BOD values often contains excessive biological contamination.

Because of this relationship, BOD became one of the most informative features in the dataset.

---

## Nitrate

Nitrates enter water through agricultural runoff, fertilizers, and sewage.

Small concentrations are common.

Excessive nitrate levels may pose serious health risks, particularly for infants.

Monitoring nitrate concentration therefore plays an important role in water quality assessment.

---

## Fecal Coliform

Fecal coliform bacteria indicate contamination from human or animal waste.

Their presence strongly suggests the possibility of disease-causing microorganisms.

This feature is particularly important because it directly relates to drinking water safety.

---

## Total Coliform

Total coliform measures overall bacterial contamination.

Although not all coliform bacteria are harmful, unusually high counts generally indicate poor water quality.

Combined with fecal coliform measurements, this feature provides strong predictive information.

---

## State

The dataset also includes the Indian state from which each water sample originated.

Geographic location may influence water characteristics because different regions have different climates, geological structures, industrial activity, and agricultural practices.

Instead of removing this information, I decided to retain it by encoding it numerically.

---

## Latitude and Longitude

Latitude and longitude identify the precise location of each water sample.

Initially, these features appeared useful.

However, during experimentation I found that they contributed very little to prediction performance while increasing dimensionality.

Therefore, they were removed during feature selection.

This helped simplify the model without sacrificing accuracy.

---

# Target Variable

The target variable represents whether the water sample is suitable for drinking.

The machine learning models attempt to learn the relationship between the input parameters and this target label.

Since there are only two possible outcomes, the problem is classified as a **binary classification problem**.

---

# Exploratory Data Analysis

Before training any model, I spent considerable time understanding the dataset.

Jumping directly into model training without first understanding the data often leads to poor results.

Exploratory Data Analysis (EDA) helped answer several important questions:

- Which features contain missing values?
- Are there duplicate records?
- Which parameters have the greatest variation?
- Which features appear correlated?
- Are there outliers?
- Is the dataset balanced?

These observations guided every preprocessing decision that followed.

---

# Missing Values

One of the biggest challenges in this project was incomplete data.

Several important parameters contained missing values.

Examples included:

- Temperature
- Dissolved Oxygen
- Conductivity
- BOD
- Nitrate
- Fecal Coliform
- Total Coliform

Simply removing rows containing missing values would have discarded a significant portion of the dataset.

Instead, I chose to impute missing values using different techniques depending on the amount of missing data.

This preserved valuable information while allowing the models to train on a much larger dataset. :contentReference[oaicite:1]{index=1}

---

# Handling Missing Values

Rather than using one universal strategy, different imputation techniques were selected according to the percentage of missing values.

## Small Percentage (<5%)

For features with only a few missing values, median imputation was used.

Examples included:

- Temperature
- DO
- pH
- Conductivity
- BOD

Median imputation is robust against extreme outliers and preserves the central tendency of skewed distributions.

---

## Moderate Missing Values

Features with larger missing percentages required more sophisticated treatment.

For variables such as:

- Nitrate
- Fecal Coliform
- Total Coliform

K-Nearest Neighbor (KNN) imputation was applied.

KNN estimates missing values using similar observations instead of simply replacing them with a global statistic.

This better preserves relationships among variables and often improves predictive performance.

---

# Duplicate Records

Duplicate records can bias machine learning models by overrepresenting certain observations.

The dataset was therefore inspected for duplicates before model training.

Any duplicate rows were removed to ensure that each observation contributed equally during learning.

---

# Feature Selection

Not every available feature improves model performance.

Adding irrelevant variables may actually reduce accuracy by introducing additional noise.

After experimentation, I removed:

- Latitude
- Longitude

while retaining:

- State

This decision reduced dimensionality while preserving useful regional information.

Feature selection also improved training efficiency and reduced unnecessary model complexity.

---

# Why I Kept the State Feature

A common interview question is:

**Why keep State but remove Latitude and Longitude?**

The answer is that latitude and longitude provide extremely fine-grained geographic information.

For this dataset, they contributed little predictive value.

The State column, however, captures broader regional characteristics such as climate, industrialization, water sources, and environmental conditions.

Therefore, keeping the State feature allowed the model to learn geographic trends without introducing unnecessary complexity.

---

# Encoding Categorical Data

Machine learning algorithms require numerical input.

Since the State column contains text values, it cannot be processed directly.

To solve this problem, One-Hot Encoding was applied.

Each state becomes a separate binary feature.

For example:

West Bengal

↓

State_West_Bengal = 1

State_Assam = 0

State_Bihar = 0

...

Although this increases the number of columns, it prevents the model from incorrectly assuming any ordinal relationship between states.

This preprocessing step later introduced one of the most interesting deployment challenges in the project—the feature mismatch between training and inference—which I'll explain in a later section.

---

# Feature Scaling

Many machine learning algorithms perform better when numerical features are on similar scales.

Parameters such as:

- Temperature
- Conductivity
- BOD
- Total Coliform

exist on completely different numerical ranges.

To address this issue, StandardScaler was used to normalize numerical features before training.

Scaling ensured that algorithms such as Support Vector Machines could converge more effectively without being dominated by features with larger numerical values.

---

# Lessons Learned from Data Preparation

One of the biggest lessons from this project was that preprocessing often requires more time than model building.

Cleaning the data, handling missing values, selecting meaningful features, encoding categorical variables, and ensuring consistent preprocessing pipelines proved far more important than simply trying different machine learning algorithms.

This experience fundamentally changed the way I approach data science projects. I now view preprocessing as the foundation upon which successful machine learning models are built.

# Machine Learning Pipeline

## Overview

Once the dataset had been cleaned and preprocessed, the next stage of the project focused on developing predictive machine learning models capable of determining whether a water sample was safe for drinking.

Rather than selecting a single algorithm immediately, I wanted to understand how different machine learning techniques behaved on the dataset.

Every algorithm has different assumptions, strengths, and weaknesses. Therefore, comparing multiple models allowed me to choose the one that balanced prediction accuracy, robustness, computational efficiency, and generalization.

Instead of treating model selection as a trial-and-error process, I followed a systematic workflow.

---

# Complete Machine Learning Workflow

```
Raw Dataset
      │
      ▼
Exploratory Data Analysis
      │
      ▼
Missing Value Handling
      │
      ▼
Feature Selection
      │
      ▼
One-Hot Encoding
      │
      ▼
Feature Scaling
      │
      ▼
Train-Test Split
      │
      ▼
Individual Model Training
      │
      ▼
Model Evaluation
      │
      ▼
Hyperparameter Tuning
      │
      ▼
Voting Ensemble
      │
      ▼
Save Model
      │
      ▼
Flask Deployment
```

Each stage depends on the previous one.

A mistake during preprocessing directly affects every model that follows.

---

# Train-Test Split

To evaluate model performance fairly, the dataset was divided into two independent subsets.

- Training Dataset
- Testing Dataset

The training dataset was used for learning patterns from historical observations.

The testing dataset remained completely unseen during training and was used to evaluate how well the model generalized to new data.

This prevents overly optimistic accuracy estimates.

---

# Algorithms Evaluated

Instead of depending on a single model, I experimented with multiple supervised learning algorithms.

The evaluated algorithms included:

- Logistic Regression
- Support Vector Machine (SVM)
- Decision Tree
- Random Forest
- Gradient Boosting
- Voting Classifier (Ensemble)

Each algorithm approaches classification differently.

Comparing them provided valuable insight into which techniques were most suitable for tabular environmental data.

---

# Logistic Regression

## Why I Selected It

Logistic Regression is often used as a baseline classifier for binary classification problems.

Although relatively simple, it provides a useful benchmark against which more sophisticated algorithms can be compared.

It is:

- Fast
- Interpretable
- Computationally efficient

---

## Advantages

- Easy to interpret
- Fast training
- Low computational cost
- Performs well on linearly separable data

---

## Limitations

Water quality parameters often have nonlinear relationships.

Because Logistic Regression assumes a linear decision boundary, its predictive capability is naturally limited compared to tree-based ensemble methods.

Although its performance was reasonable, it was not selected as the final model.

---

# Support Vector Machine (SVM)

## Why I Chose SVM

Support Vector Machines are well known for their ability to classify complex datasets using nonlinear decision boundaries.

Because water quality depends on multiple interacting parameters, SVM appeared to be a promising candidate.

---

## Advantages

- Strong mathematical foundation
- Effective in high-dimensional spaces
- Good generalization
- Works well with smaller datasets

---

## Why Scaling Was Important

Unlike tree-based algorithms, SVM is sensitive to feature magnitudes.

This is one of the primary reasons StandardScaler was applied before training.

Without scaling:

- Conductivity
- Total Coliform

would dominate smaller numerical features such as pH.

Scaling ensured each feature contributed fairly during optimization.

---

## Performance

SVM produced approximately **78% accuracy**.

Although respectable, it was significantly lower than the best-performing ensemble methods.

This suggested that the dataset contained nonlinear relationships that could be captured more effectively by tree-based algorithms.

---

# Decision Tree

## Motivation

Decision Trees are intuitive models capable of learning nonlinear decision boundaries without requiring feature scaling.

They also provide interpretable decision paths.

---

## Advantages

- Easy visualization
- No scaling required
- Captures nonlinear relationships

---

## Limitations

Individual decision trees tend to overfit training data.

Although the model achieved very high accuracy on this dataset, relying on a single tree was considered risky because it might not generalize well to unseen samples.

This motivated the use of Random Forest.

---

# Random Forest

## Why Random Forest?

Random Forest combines multiple decision trees into an ensemble.

Instead of depending on one tree, many independent trees vote for the final prediction.

This generally produces:

- Higher accuracy
- Better robustness
- Reduced overfitting

---

## Advantages

- Excellent performance
- Robust against noise
- Handles nonlinear relationships
- Works well on tabular datasets

---

## Performance

Random Forest achieved approximately **95% accuracy**, making it one of the strongest individual models.

The algorithm consistently produced reliable predictions across different evaluation metrics.

---

## Why It Wasn't My Final Choice

Although Random Forest performed extremely well, Gradient Boosting achieved slightly better overall performance after optimization.

Therefore, Random Forest became part of the final ensemble rather than the sole deployed model.

---

# Gradient Boosting

## Why I Wanted to Try Gradient Boosting

Gradient Boosting differs fundamentally from Random Forest.

Instead of training many independent trees simultaneously, Gradient Boosting trains trees sequentially.

Each new tree focuses on correcting mistakes made by previous trees.

This iterative learning strategy often produces highly accurate predictive models.

---

## Advantages

- Excellent predictive accuracy
- Learns complex relationships
- Handles nonlinear data
- Strong performance on structured datasets

---

## Hyperparameter Optimization

To improve performance, multiple hyperparameters were tuned.

The optimized configuration included:

- Learning Rate: 0.01
- Maximum Depth: 3
- Number of Estimators: 100

These values provided a good balance between bias and variance.

---

## Performance

Gradient Boosting became the best-performing individual model.

Approximate evaluation metrics included:

Accuracy:

97%

Precision:

95%

Recall:

95%

F1 Score:

95%

ROC-AUC:

99%

These results demonstrated excellent classification capability while maintaining good generalization.

---

# Why Gradient Boosting Performed Better

Gradient Boosting improves predictions iteratively.

Each tree attempts to correct the errors produced by previous trees.

For environmental datasets containing complex feature interactions, this strategy often performs better than independent tree voting.

The model successfully captured subtle nonlinear relationships between:

- DO
- BOD
- Conductivity
- Nitrate
- Coliform counts

that simpler algorithms struggled to model.

---

# Why I Didn't Use Deep Learning

A common recruiter question is:

> "Why didn't you build a neural network?"

There were several reasons.

## Dataset Size

The dataset contained approximately 1,300 samples.

Deep neural networks generally require significantly larger datasets.

---

## Structured Data

The dataset consisted of tabular numerical features.

Tree-based ensemble algorithms often outperform deep learning models on structured tabular data.

---

## Interpretability

Tree-based models provide better feature importance analysis.

Environmental applications benefit from interpretable predictions.

---

## Computational Efficiency

Gradient Boosting trained significantly faster while achieving excellent accuracy.

Using deep learning would have increased complexity without providing meaningful performance improvements.

---

# Voting Classifier

Although Gradient Boosting achieved the highest individual performance, I wanted to investigate whether combining multiple models could improve robustness.

I therefore implemented a soft Voting Classifier.

The ensemble combined:

- Support Vector Machine
- Random Forest
- Logistic Regression
- Gradient Boosting

Instead of relying on a single prediction, the ensemble considers probability estimates from multiple models before making the final decision.

---

# Why Ensemble Learning?

Different algorithms make different mistakes.

Combining them reduces the probability that one model's weakness dominates the final prediction.

Benefits include:

- Improved stability
- Better generalization
- Reduced variance
- Higher robustness

This makes ensemble learning particularly attractive for practical machine learning systems.

---

# Evaluation Metrics

Accuracy alone is not sufficient.

Several complementary metrics were evaluated.

## Accuracy

Percentage of correctly classified samples.

---

## Precision

Measures how many predicted positive samples are actually correct.

High precision reduces false alarms.

---

## Recall

Measures how many actual positive samples are correctly identified.

High recall minimizes missed unsafe water samples.

---

## F1 Score

The harmonic mean of Precision and Recall.

Useful when balancing false positives and false negatives.

---

## ROC-AUC

Measures the model's ability to separate classes across multiple thresholds.

A value close to 1 indicates excellent discriminative capability.

---

# Final Model Selection

After comparing all models, I selected the optimized Gradient Boosting model as the primary deployed model because it consistently achieved the highest balance of:

- Accuracy
- Precision
- Recall
- F1 Score
- Generalization

The ensemble Voting Classifier was also explored to evaluate whether combining multiple algorithms could further improve robustness.

---

# Lessons Learned

This stage of the project taught me several important lessons.

The first is that selecting a sophisticated algorithm does not automatically produce the best results. Proper preprocessing and feature engineering often contribute more to overall performance than changing the model.

The second lesson is that different algorithms excel under different conditions. Rather than assuming one model is universally superior, it is important to compare multiple approaches objectively using appropriate evaluation metrics.

Finally, I learned that machine learning is an iterative engineering process. Building a successful model involves experimentation, evaluation, refinement, and continuous improvement rather than simply training a single algorithm once.

---

# Recruiter Questions

## Why did you evaluate multiple algorithms instead of choosing one immediately?

Different algorithms have different strengths and assumptions. Comparing several models allowed me to identify the approach that best suited the characteristics of the dataset rather than relying on assumptions.

---

## Why did Gradient Boosting outperform Random Forest?

Random Forest builds trees independently, while Gradient Boosting builds trees sequentially, allowing each new tree to correct errors made by previous trees. This often results in better predictive performance on structured datasets.

---

## Why use ensemble learning?

Ensemble methods reduce the weaknesses of individual models by combining their predictions. This generally improves robustness and generalization.

---

## Why not use a neural network?

The dataset was relatively small and consisted of structured tabular data. Tree-based ensemble methods are generally more suitable for this type of problem and achieved excellent performance with lower computational cost.

---

## If you repeated this project today, what would you try?

I would experiment with XGBoost, LightGBM, CatBoost, TabNet, and transformer-based tabular models. I would also perform automated hyperparameter optimization using Optuna or Bayesian Optimization and evaluate the models through k-fold cross-validation.