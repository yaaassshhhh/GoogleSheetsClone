# React + Vite

React Spreadsheet Application
A powerful web-based spreadsheet application built with React and Redux, featuring advanced data manipulation, visualization, and formatting capabilities.
🚀 Features
Core Spreadsheet Functionality

Dynamic Grid: Resizable rows and columns with smooth scrolling
Cell Operations:

Basic data entry and editing
Formula support with real-time evaluation
Cell referencing (e.g., =A1+B1)
Cell range selection with mouse drag
Double-click or F2 to edit cells



Dimension Controls

Add/Remove rows and columns dynamically
Resize rows and columns using drag handles
Custom column widths and row heights

Cell Formatting

Text formatting: Bold, Italic, Underline
Font customization: Size, Family, Color
Text alignment options
Background color
Number formatting

Formula Support
Mathematical Functions

SUM(range): Calculate sum of cells
AVERAGE(range): Calculate average
MAX(range): Find maximum value
MIN(range): Find minimum value
COUNT(range): Count non-empty cells
MEDIAN(range): Calculate median
STDDEV(range): Calculate standard deviation
VARIANCE(range): Calculate variance
PRODUCT(range): Calculate product
MODE(range): Find mode
RANGE(range): Calculate range (max-min)

Data Quality Functions

TRIM(cell): Remove extra spaces
UPPER(cell): Convert to uppercase
LOWER(cell): Convert to lowercase
REMOVE_DUPLICATES(range): Remove duplicate values
FIND_AND_REPLACE(cell, find, replace): Text replacement

Data Visualization

Chart creation functions with multiple types:

CHART(range) or LINECHART(range): Line chart
BARCHART(range): Bar chart
PIECHART(range): Pie chart
AREACHART(range): Area chart



🛠️ Technology Stack
Frontend

React.js
Redux Toolkit for state management
Tailwind CSS for styling
react-window for virtualized grid rendering

Libraries

recharts: Data visualization
Lodash: Utility functions

🏗️ Architecture
State Management

Redux store with slices for:

Cell data and formatting
Grid dimensions
Selection and active cell state
Error handling



Components

Grid: Main spreadsheet component with virtualized rendering
Cell: Individual cell component with editing capabilities
FormulaeBar: Formula input and cell reference display
DimensionControls: Row and column management
ChartComponent: Data visualization renderer
ResizeHandle: Row/column resize functionality

🎯 How to Use
Basic Operations

Cell Editing:

Double-click any cell or press F2 when cell is selected
Type value or formula
Press Enter or click outside to save


Formula Entry:

Start with '=' symbol
Reference cells using their coordinates (e.g., A1, B2)
Use mathematical operators (+, -, *, /)
Use functions like SUM, AVERAGE, etc.


Cell Selection:

Click to select single cell
Click and drag to select range
Use shift+click for multiple selection



Using Functions

Mathematical Calculations:
Copy=SUM(A1:A5)
=AVERAGE(B1:B10)
=MAX(C1:C20)

Data Quality:
Copy=TRIM(A1)
=UPPER(B1)
=FIND_AND_REPLACE(A1, "old", "new")

Creating Charts:
Copy=BARCHART(A1:A10)
=PIECHART(B1:B5)
=LINECHART(C1:C15)


Formatting

Select cell(s)
Use the formatting toolbar to:

Apply text styles (bold, italic, underline)
Change font properties
Adjust alignment
Set background color



Grid Management

Use the dimension controls to:

Add/remove rows and columns
Adjust row heights and column widths
Navigate through the spreadsheet



⚠️ Important Notes

Formula Dependencies:

Cells update automatically when referenced cells change
Circular references are not supported


Performance:

Grid virtualization handles large datasets efficiently
Complex formulas on large ranges may impact performance


Data Persistence:

Currently operates in-memory
Implement your own persistence layer as needed



🔍 Tips and Best Practices

Use cell references in formulas instead of hard-coded values
Leverage range operations for bulk calculations
Use appropriate chart types for different data sets
Regularly check for formula errors
Use data quality functions to maintain clean data