import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn import tree
from transformers import pipeline

# Load Dataset
df = pd.read_csv("symptom_data.csv")

# Extract Features & Labels
X = df.drop(columns=["diagnosis"])  # Symptoms
y = df["diagnosis"]  # Disease labels

# Split Data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Decision Tree Model
clf = DecisionTreeClassifier(criterion="entropy", max_depth=4)
clf.fit(X_train, y_train)

# Evaluate Accuracy
accuracy = clf.score(X_test, y_test)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Visualize Tree
tree.plot_tree(clf, feature_names=X.columns, class_names=clf.classes_, filled=True)
