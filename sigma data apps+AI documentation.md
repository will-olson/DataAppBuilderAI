About Sigma data apps  
Suggest Edits  
Data apps are purpose-built solutions that connect directly to your data platform to seamlessly integrate live data, workflows, and user inputs. You can leverage Sigma's write-back capabilities, advanced layout features, and rich user interactivity to build dynamic, user-driven applications that extend beyond standard data analysis and reports. From simple data collection forms and approval flows to more complex pipeline management and ticketing systems, Sigma supports a growing range of practical data app use cases.

What makes a data app?  
While you can incorporate any workbook feature into a data app, there are three key components of an interactive data app experience: input tables, layout elements, and actions.

Input tables  
Layout elements  
Actions  
1\. Input tables for data collection  
Input tables allow users to securely add new data points, update existing inputs, and augment data from your data platform. This ability to collect data from users is essential to core data app functionality, allowing user interaction to modify data and generate specific outputs for scenario modeling, forecasting, reconciliation, and more.

For more information about input tables, see Intro to input tables.

2\. Layout elements for interface design  
Layout elements provide the tools to design clean, focused interfaces that are easy to navigate. Containers and modals optimize how you deliver data and content, allowing you to organize information, guide workflows, and surface insights when and where users need them. Implement layout elements to help users perform data input and drill into details with efficiency—free from the distractions of unnecessary workbook clutter.

For more information about layout elements, see Intro to layout elements.

3\. Actions for user interactivity  
Actions are essential to building responsive data apps that automate user interactivity. Configure action conditions, triggers, and effects, to streamline scalable, data-driven workflows that support adaptive data exploration, run repeatable processes, and generate quick and relevant insights.

Intro to input tables  
Suggest Edits  
🚩  
Input tables are generally available on Snowflake, Databricks, and Amazon Redshift connections with write-access enabled.

On BigQuery connections, input tables are in public beta and the following information applies:

This documentation describes a public beta feature and is under construction. This documentation should not be considered part of our published documentation until this notice, and the corresponding Beta flag on the feature in Sigma, are removed. As with any beta feature, the feature discussed below is subject to quick, iterative changes. The latest experience in the Sigma service may differ from the contents of this document.

Beta features are subject to the Beta features disclaimer.

Input tables are dynamic workbook elements that support structured data entry. They allow you to integrate new data points into your analysis and augment existing data from your data platform to facilitate rapid prototyping, advanced modeling, forecasting, what-if analysis, and more—without overwriting source data.

Use input tables as sources for tables, pivot tables, and visualizations, or incorporate the data using lookups and joins. And when you create warehouse views for input tables, you can reuse the manually entered data across your broader data ecosystem.

This document introduces the fundamentals of input tables (functionality, types, and columns), and explains how Sigma handles the data.

Input table functionality  
Input tables enable you to do the following:

Add new rows (empty and CSV input tables only)  
Add new columns (including data entry, computed, row edit history, and system columns)  
Upload and edit CSV data (max 200 MB, UTF-8 only)  
Input values through keyboard entry  
Paste up to 50,000 cells at once (2,000 rows and 25 columns) from your clipboard  
Configure data entry permissions  
Configure data validation  
Protect columns to prevent edits  
For information about using this functionality, see Create new input tables, Configure data governance options in input tables, and Edit existing input table columns.

Types of input tables  
Sigma offers three types of input tables:

Empty input tables  
CSV input tables  
Linked input tables  
Empty input tables  
Empty input tables are blank tables that support data entry in standalone tables independent of existing data. You can edit data at the cell level and add editable rows and columns to construct your table as you see fit.

CSV input tables  
CSV input tables also support data entry in standalone tables; however, they allow you to pre-populate the table with uploaded CSV data (max 200 MB, UTF-8 only). You can then edit the uploaded data at the cell level and add other editable rows and columns to construct your table as you see fit.

Linked input tables  
Linked input tables support data entry alongside existing data from other elements in the same workbook.

As a child element, a linked input table includes one or more linked columns that reference data in the parent element. This includes a primary key column containing row identifiers that establish the table’s granularity. You can then add other columns to augment the linked data sourced from the parent element.

To maintain the data relationship between the input table rows and source data in the parent element, the primary key column must reference static values. All other linked columns can reference variable data, which is continually updated in the input table to reflect live data from the source.

🚧  
Do not use a calculated column as a primary key column. Using calculated columns, especially generated row numbers (such as from the RowNumber() function) , as primary keys in linked input tables can lead to inconsistent behavior in your workbook. Since these keys are derived from calculations, they can change with data modifications, such as inserts, deletes or simple edits. This instability may result in:

Duplicate Keys: Changes in row order can lead to duplicates, violating key constraints.  
Data Integrity Issues: Relationships relying on these keys may break, causing referential integrity problems.  
Primary keys should always be stable, unique identifiers, preferably derived from underlying stable data.

Types of input table columns  
Input tables support the following types of columns:

Type	Description	Available columns  
Data entry column	Supports direct user input at the individual cell level	Text, Number, Date, Checkbox, Multi-select  
Computed column	Generates values based on a user-defined formula or lookup	Calculation, Via lookup  
Row edit history column	Displays system-generated metadata related to row-level edits	Last updated at, Last updated by, Created at, Created by  
System column	Displays system-generated metadata related to table components	  
Row ID

Available for empty or CSV input tables only

Input table data governance  
Data governance features (data validation and data entry permissions) allow you to preserve data integrity and enhance the security of input tables. You can also include system-generated columns (row edit history and row ID) to surface input table metadata for auditing and other data management purposes.

For more information, see the following documentation:

Apply data validation to input table columns  
Customize data entry permission on input tables  
Add system-generated columns to input tables  
How input table data is handled  
Sigma handles input tables in a distinct manner due to the ad hoc nature of the data. The following information explains how input table data is stored, retrieved, and removed.

Storage  
Sigma writes input table data to tables in a designated write-back schema in your data platform. This destination schema, identified in the connection's details (Admin \> Connections), stores input table data separate from existing source data that Sigma cannot overwrite.

In addition to creating tables that store input table data, Sigma creates an edit log (also known as a write-ahead log or WAL) that contains a sequential record of all input table changes, including information related to user activity and resulting system operations. Tables containing input table data have object names prepended with SIGDS, and the table containing the edit log is prepended with SIGDS\_WAL.

Retrieval  
Since Sigma writes input table data to a write-back schema optimized for storage, you cannot query the resulting tables directly. To access input table data in an indirect but query-friendly format, create warehouse views for individual input tables, then retrieve the data from the views using the SQL FROM clause.

Removal  
You can delete input table elements in workbooks, but Sigma does not delete the corresponding input table data written to your data platform. To remove this data, you must delete it directly in the data platform.

Create new input tables  
Suggest Edits  
Create input tables to integrate new data points into your analysis and augment existing data. Manage table structure, enter cell values, and configure advanced options, including data validation, column protection, data entry permission, and row edit history.

This document explains how to create and build empty, CSV, and linked input tables. For an overview of input table features and how to configure them, see Intro to input tables and Configure data governance options for input tables. For information about editing input table data, see Edit existing input table columns.

📘  
This feature isn't supported by all data platform connections. To check if your connection supports it, see Supported data platforms and feature compatibility.

System and user requirements  
The ability to create new input tables requires the following:

You must be granted Can use data permission on a connection that supports input tables and has write access enabled.  
If using input tables on an OAuth-enabled connection, see Configure OAuth with write access for additional requirements.  
If using input tables on an Amazon Redshift connection, the enable\_case\_sensitive\_identifier configuration value in Redshift must be set to false. If set to true, attempts to create new input tables will fail.  
You must be assigned an account type with the Create input tables and Create, edit, and publish workbooks permissions enabled.  
You must be the workbook owner or be granted Can edit workbook permission. Unlike other workbook elements, input tables cannot be created in custom views. You can only create new input tables in the draft version of a workbook.  
For information about permissions required to edit input table data, see Edit existing input table columns.

Create a new input table  
Sigma features multiple types of input tables to support a variety of use cases for ad hoc data entry. The following subsections explain how to create the following input table types:

Empty input tables  
CSV input tables  
Linked input tables  
Create an empty input table  
Create an empty input table to support data entry independent of existing data.

Open a workbook in Edit mode.

In the navigation menu, click  Add element to open the Add new element panel.

In the Input Tables section, select Empty.

Select the connection and write destination for the input table data:

In the Select a connection dropdown, select the connection Sigma will use to write the input table data to your data platform. Sigma only allows the selection of connections with write access enabled.

In the Destination dropdown, select a write-back schema.

Click Create.

If you only have permission to write to one connection or one write-back schema within the selected connection, Sigma automatically applies that option and doesn’t require you to make a selection.

Sigma adds an empty, single-column input table to the workbook. See Customize input table structure in this document to continue building your input table.

Create a CSV input table  
Create a CSV input table to support data entry with pre-populate editable data from a CSV upload.

Open a workbook in Edit mode.

In the navigation menu, click  Add element to open the Add new element panel.

In the Input Tables section, select CSV.

In the Upload CSV page, drag and drop a CSV file into the specified area, or click Browse and select it in the file dialog.

📘  
The CSV file cannot exceed 200 MB in size and must use UTF-8 encoding.

Review the parsed data and warnings, if applicable, then update the parsing options and column types as needed.

Click Save to apply the CSV data to the input table.

Sigma adds the pre-populated CSV input table to the workbook. See Customize input table structure in this document to continue building your input table.

Create a linked input table  
Create a linked input table to support data entry alongside existing data from other elements in the same workbook.

Open a workbook in Edit mode.

In the navigation menu, click  Add element to open the Add New panel.

In the Input tables section, select Linked.

In the Select source modal, select an element in the workbook to use as the input table’s data source.

In the Create linked input table modal, select source columns to link in the input table:

📘  
Linked columns, including the primary key, aren’t editable at the cell level in the input table. Values are inherited from the source element and continually reflect live data as that element updates.

Select at least one column to populate row identifiers in the primary key column.

💡  
Row identifiers in the input table’s primary key column are based on unique values in the selected source column. To ensure consistent and reliable row identifiers, choose a source column containing unchanging values (like static IDs, product names, or regions). Dynamic values in the primary key column can lead to the loss of row data when a row identifier changes.

Select additional columns to populate other source data in the input table.

Click Create input table.

Sigma adds the linked input table to the workbook. By default, it includes the selected source columns and a single data entry column. See Customize input table structure in this document to continue building your input table.

Customize input table structure  
Sigma enables you to customize the structure of an input table to optimize your analysis and reporting. The following subsections explain how to complete the following tasks:

Insert rows  
Add columns  
Move columns  
Rename columns  
Change column types  
Insert rows  
Insert new rows into empty or CSV input tables to create new data records for your analysis. Linked input tables don’t support the manual addition of rows since row count and granularity are defined by the primary key column.

To insert a new row, right-click anywhere in an existing row, then select Insert 1 row above or Insert 1 row below.

To insert multiple new rows, multi-select consecutive rows, right-click the selection, then select Insert \[\#\] rows above or Insert \[\#\] rows below.

To add a row to the bottom of the input table, click the last row containing a plus (+) in the header column.

📘  
You cannot insert rows when column protection is applied to one or more columns in the input table.

Add columns  
Add columns to enable data input, display row edit history, or include unique row identifiers.

Click the caret () in any column header (or the caret associated with any column name in the Columns panel).

In the column menu, hover over Add new column, then select a column option:

Text, Number, Date, Checkbox, or Multi-select	Data entry columns that enable cell-level user input.  
Calculation or Via lookup	Computed columns that generate data based on a formula or lookup.  
Last updated at, Last updated by, Created at, or Created by	Row edit history columns that display metadata related to row edits. For more information see Add row edit history.  
Row ID	System column that generates unique IDs for each row. For more information, see Add row ID.  
Sigma adds an empty column following the column referenced in the previous step.

Move columns  
Move columns to reorganize the input table.

To move a single column, click and hold the column header (or the column name in the Columns panel), then drag and drop the column to the preferred position.

To move multiple columns, select multiple column names in the Columns panel, then drag and drop the selection to the preferred position.

To move one or more columns to the beginning or end of the table, select the columns directly in the table (or in the Columns panel). Right-click the selection to open the column menu, then hover over Move to and select Start or End.

Rename columns  
Rename columns to reflect the context of the column data.

Click the caret () in any column header (or the caret associated with any column name in the Columns panel).

In the column menu, select Rename column to enable in-place editing.

Edit the column name, then press the Enter key.

💡  
You can also double-click the column header or name to enable in-place editing.

Change column types  
Change column types (text, number, date, or checkbox) to optimize storage, query performance, and your overall analysis.

Click the caret () in a column header (or the caret associated with any column name in the Columns panel).

In the column menu, hover over Change column type, then select Text, Number, Date, or Checkbox. If the column contains data, Sigma automatically removes values that don’t correspond with the selected data type.

📘  
You cannot change the data type if data validation or column protection is applied to the specific column.

Enter table data  
Enter cell-level data in input tables through keyboard entry, copy/paste, checkbox toggle, or dropdown selection. You can also define cell values in calculation columns using custom formulas.

For information about the ongoing data entry workflow in a workbook draft versus a published version, see Edit existing input table columns and Configure data governance options for input tables.

📘  
Input table cells only accept values that align with the column’s data type. If you enter an invalid value, the cell clears the data.

To enter data through keyboard entry, select a cell and enter a value.

To paste copied values, select a cell or range of cells, then right-click the selection and select Paste.

💡  
You can select and paste values in up to 50,000 cells at once (2,000 rows and 25 columns, including the header). When you copy multiple rows of data and select a column header or a range of cells that include a header in the input table, the first row of the copied data is pasted in the header.

To change a cell value in a checkbox column, click the checkbox to toggle between true (selected) and false (cleared). You can also press the Delete key to remove the checkbox and generate a null value.

To select a predefined value in a multi-select column or a column containing data validation, click the caret () in a cell (or double-click the cell), then select an option from the dropdown.

To define values in a calculation column, click the column header or any cell in the column, then enter an expression in the formula bar.

Add or edit input table data  
Suggest Edits  
Depending on your workbook access and the data entry permission on individual input table elements, you can directly add or edit input table data in the draft or published version of a workbook.

This document explains how to identify editable input tables, access the editable state, and add or edit data based on the workbook version you're interacting with.

For more information about how to change the data entry permission on a specific input table, see Customize data entry permission on input tables. For general information about input tables, see Intro to input tables.

System and user requirements  
The ability to add or edit data in existing input table columns requires the following:

In a workbook draft:

You must be assigned an account type with the Create, edit, and publish workbooks permission enabled.  
You must be the workbook owner or be granted Can edit access to the workbook.  
In a workbook's published version:

You must be assigned an account type with the Basic explore permission enabled.  
You must be the workbook owner or be granted Can explore or Can edit access to the workbook.  
For permissions required to create new input tables and manage table structure, see Create new input tables. For permissions required to configure data governance features, see Configure data governance options for input tables.

Identify editable input tables  
Data entry permission is configured at the individual input table level, which can result in workbooks containing some input tables that are editable in the draft only and others that are editable in the published version only. Refer to the following sections to determine whether a specific input table is editable in the draft or public version of a workbook.

Identify editable input tables in a workbook draft

Identify editable input tables in a workbook's published version

Identify editable input tables in a workbook draft  
When interacting with a workbook draft, an input table element displays an Editable in label above the table, which indicates whether data entry is allowed in the draft or published version.

📘  
Data entry permission only affects your ability to add or edit data in existing input table columns. In the workbook draft, you can still customize the table structure, manage column settings, and configure data governance options, regardless of the data entry permission.

If the element displays an Editable in draft label, the input table data is immediately editable. See Add or edit data in a workbook draft.

🚧  
Input tables can be restricted from all edits when the connection used to write input table data to your data platform is unavailable or misconfigured. When this occurs, the element displays an "Editing restricted" warning message next to the Editable in draft label, and you cannot add or edit the input table data. If you encounter this restriction, contact your Sigma organization admin to resolve the issue. For more information, see Input table error handling.

If the element displays an Editable in published version label, the input table data is not immediately editable. To add or edit data, you can change the data entry permission or switch to the workbook's published version.

Identify editable input tables in a workbook's published version  
When interacting with a workbook's published version, an input table element displays an  Edit data button if data entry is allowed in the publish version. Additional factors, described below, can determine whether you can access the editable state to add or edit data.

If the  Edit data button is displayed and enabled, you can access the editable state and directly add or edit data in existing columns. See Add or edit data in a workbook's published version.

If the  Edit data button is displayed but disabled, the input table is editable in the published version, but you cannot currently access the editable state to add or edit data. This restriction is likely due to insufficient workbook access. If necessary, contact the workbook owner to request an access upgrade.

🚧  
Input table edits can also be restricted when the connection used to write input table data to your data platform is unavailable or misconfigured. When this occurs, the element displays an "Editing restricted" warning message next to the disabled button. If you encounter this restriction, contact your Sigma organization admin to resolve the issue. For more information, see Input table error handling.

If the  Edit data button is not displayed, the input table is not editable in the published version. If you have the applicable workbook access, you can add or edit input table data in the draft (see Add or edit data in a workbook draft). Otherwise, you can only view the input table.

Add or edit data  
When adding or editing input table data, the entry point to the editable state and the mechanism for saving your changes depend on the workbook version you're interacting with. Refer to the following workflows to add or edit input table data in the workbook draft or published version.

Add or edit data in a workbook draft

Add or edit data in a workbook's published version

Add or edit data in a workbook draft  
When an input table's data entry permission allows edits in the workbook draft, you can immediately add or edit data directly in the editable columns.

Open the draft of a workbook and locate the input table you want to edit.

If the input table element displays an Editable in draft label above the table, you can immediately add or edit data in editable columns using the following methods. If the element displays an Editable in published version label, you must first change the data entry permission or switch to the workbook's published version.

📘  
Editable columns display a pencil icon () in the column header. Linked columns (in linked input tables), calculations, lookups, and system columns are not editable.

To enter data through keyboard entry, select a cell and enter a value.

To paste copied values, select a cell or range of cells, then right-click the selection and select Paste (or use the ⌘+V or Ctrl+V keyboard shortcut).

💡  
You can select and paste values in up to 50,000 cells at once (2,000 rows and 25 columns, including column headers). When you copy multiple rows of data and select a column header or range of cells that include a column header in the input table, the first row of copied data is pasted in the header.

To change a cell value in a checkbox column, click the checkbox to toggle between true (selected) and false (cleared). To remove the checkbox and generate a null value, select the cell and press Delete.

To select a predefined value in a multi-select column or a column containing data validation, click the down arrow () in a cell (or double-click the cell), then select an option from the dropdown.

To define values in a calculation column, click the column header or any cell in the column, then enter an expression in the formula bar.

💡  
If the formula bar is not visible, click  Show panels in the workbook header to reveal the toolbar (containing the formula bar) and editor panel.

Sigma automatically saves all edits to the draft. To save your changes to the workbook's published version, click Publish in the workbook header.

🚧  
Input table edits can be unsuccessful due to configuration or availability issues in the connection or data platform (which must be resolved by the customer). To improve data integrity and prevent unexpected data loss when a connection is misconfigured or unavailable, Sigma blocks edits to relevant input tables and displays an "Editing restricted" message directly on the input table elements. If you're restricted from editing an input table due to a misconfigured or unavailable connection, contact your Sigma organization admin to resolve the issue. For more information, see Input table error handling.

Add or edit data in a workbook's published version  
When an input table's data entry permission allows edits in the workbook's published version, you can access the input table's editable state to add or edit data directly in existing editable columns.

Open the published version of a workbook and locate the input table you want to edit.

To switch from the draft to the published version, click the down arrow () next to the Publish button in the workbook header, then select Go to published version.

In the input table element, click  Edit data to enable editing.

If the button is disabled, you cannot access the editable state. See Identify editable input tables in a workbook's published version for more information.

Use the following methods to add or edit data in existing editable columns:

📘  
Editable columns display a pencil icon () in the column header. Linked columns (in linked input tables), calculations, lookups, and system columns are not editable.

To enter data through keyboard entry, select a cell and enter a value.

To paste copied values, select a cell or range of cells, then right-click the selection and select Paste, or use the ⌘+V or Ctrl+V keyboard shortcut.

💡  
You can select and paste values in up to 50,000 cells at once (2,000 rows and 25 columns), not including column headers since you cannot edit headers in the published version of a workbook.

To change a cell value in a checkbox column, click the checkbox to toggle between true (selected) and false (cleared). To remove the checkbox and generate a null value, select the cell and press Delete.

To select a predefined value in a multi-select column or a column containing data validation, click the down arrow () in a cell (or double-click the cell), then select an option from the dropdown.

To define values in a calculation column, click the column header or any cell in the column, then enter an expression in the formula bar.

💡  
If the formula bar is not visible, click  Show panels in the workbook header to reveal the toolbar (containing the formula bar) and editor panel.

The input table displays yellow cell indicators to mark cells with unsaved data. Click Save to apply your changes to the draft and published version.

🚧  
Input table edits can be unsuccessful due to configuration or availability issues in the connection or data platform (which must be resolved by the customer). To improve data integrity and prevent unexpected data loss when a connection is misconfigured or unavailable, Sigma blocks edits to relevant input tables and displays an "Editing restricted" message directly on the input table elements. If you're restricted from editing an input table due to a misconfigured or unavailable connection, contact your Sigma organization admin to resolve the issue. For more information, see Input table error handling.

Configure multi-select columns on input tables (Beta)  
Suggest Edits  
🚩  
This documentation describes a public beta feature and is under construction. This page should not be considered part of our published documentation until this notice, and the corresponding Beta flag on the feature in the Sigma service, are removed. As with any beta feature, the feature discussed below is subject to quick, iterative changes. The latest experience in the Sigma service might differ from the contents of this document.

Beta features are subject to the Beta features disclaimer.

Use multi-select columns in input tables to enable users to add one or more discrete values to a single cell. You can create and manage a predefined list of custom values or choose an existing data source or element in the workbook to populate the list. Values are displayed as individual pills and can be assigned different colors for visual differentiation and clarity.

This document explains how to add a multi-select column to an input table and configure the list of values users can select.

📘  
This feature isn't supported in all regions. To check if it is supported in your region, see Supported data platforms and feature compatibility.

System and user requirements  
The ability to create a new input table and configure a multi-select column requires the following:

You must have Can use access to a connection that supports input tables and has write access enabled.  
If using input tables on an OAuth-enabled connection, see Configure OAuth with write access for additional requirements.  
If using input tables on an Amazon Redshift connection, the enable\_case\_sensitive\_identifier configuration value in Redshift must be set to false. If set to true, attempts to create or edit input tables will fail.  
You must be assigned an account typewith the Create input tables and Create, edit, and publish workbooks permissions enabled.  
You must be the workbook owner or have Can edit access to the workbook. Unlike other workbook elements, input tables cannot be created in custom views. You can only create new input tables in the workbook draft.  
For information about permissions required to edit input table data, see Edit existing input table columns.

Add a multi-select column to an input table  
Add a multi-select column that allows users to add one or more discrete values to a single cell.

Create a new input table or select an existing one.

In the input table, click the plus () icon at the end of the column header, then select Multi-select from the dropdown.

Sigma adds a multi-select column and opens the Edit values modal, which allows you to define the selectable values as detailed in Configure a list of available values section of this document.

Configure a list of available values  
There are two ways to define the values that users can add to cells in a multi-select column.

Create a list of custom values  
Reference values from a column in an existing data source or element  
Create and manage a list of custom values  
Manually enter values to create a list of custom values that users can select. You can also assign display colors and customize the list order.

📘  
When a user accesses the workbook's draft version, they can enter new values directly into a multi-select column cell. Those values are automatically added to the predefined list of available values.

In the multi-select column's header, click the down arrow () and select Edit values from the column menu.

In the Edit values modal, configure the list of available values:

Click the Value source field and select Create manual list from the dropdown.  
In the Define values section, add, edit, or remove values:  
To add a new value, click the Add value input field, then enter a value. Press the Enter key to open a new input field and add another value.  
To edit an existing value, click the applicable field and edit the value.  
To remove a specific value, hover over the applicable field and click  Remove.  
To remove all values, click Clear all.  
\[optional\] Assign colors to individual values (colors apply to the value pills displayed in the column cells):  
To automatically assign a different color to each value as it's added, select the Assign categorical colors when items are added checkbox.  
To manually assign a color to each value, click the applicable color swatch, then use the color picker.  
\[optional\] To reorder the list, click and drag any value's drag handle ().  
Click Save.

Choose an existing data source or element to populate a list of values  
Reference a column from a data source or element in the current workbook to populate a list of values. The values available for users to select in the multi-select column are based on the values in the source column and can change as the column values are updated.

In the multi-select column's header, click the down arrow () and select Edit values from the column menu.

In the Edit values modal, configure the list of available values:

Click the Value source field and select a data source or element from the dropdown.

Click the secondary field and select a column from the selected data source or element.

In the Preview values section, confirm that these are the values users must be able to select in the column.

\[optional\] Assign colors to individual values (colors apply to the value pills displayed in the column cells):

To automatically assign a different color to each value, select the Assign categorical colors to items checkbox  
To manually assign a color to each value, click the applicable color swatch, then use the color picker.  
Click Save.

Configure data governance options for input tables  
Suggest Edits  
Data governance features (data validation and data entry permissions) allow you to preserve data integrity and enhance the security of input tables. You can also include system-generated columns (row edit history and row ID) to surface input table metadata for auditing and other data management purposes.

Apply data validation to input table columns  
Suggest Edits  
Data validation ensures data accuracy and consistency by restricting data entry to a set of specific values. When you apply data validation to an input table column, users can only enter or select one of the predefined values from a dropdown.

📘  
Sigma only supports data validation for text, number, and date columns. Data validation doesn’t apply to checkbox data columns because Sigma already restricts the values to true (selected) or false (cleared).

This document explains how to apply data validation to input tables.

System and user requirements  
The ability to apply data validation to input tables requires the following:

Your organization must be connected to a data platform compatible with input tables. See Region, warehouse, and feature support.

You must be granted Can use data permission for a connection with write access enabled. If using an OAuth-enabled connection, see Configure OAuth with write access for additional requirements.

You must be assigned an account type with the Create input tables and Create, edit, and publish workbooks permissions enabled.

You must be the workbook owner or be granted Can edit workbook permission.

Apply data validation  
Click the caret () in a column header to open the column menu, then select Data validation.

In the Data validation modal, create a manual list of predefined values, or apply the values from a column in an existing data source or element in the workbook:

Create a manual list of values:

In the Value source dropdown, select Create manual list.

In the Define values field, enter values that align with the column’s data type.

💡  
Enter individual values, or paste multiple values copied from Sigma or an external source (like a spreadsheet or text document).

Click Save.

Apply values from a column in an existing data source or element:

In the Value source dropdown, select a data source or element.

In the secondary dropdown, select a source column to define the values.

Review the column values, then click Save to proceed.

Sigma checks existing data against the defined values and displays red indicators in cells that contain invalid data.

To replace invalid data, manually enter valid values, or click the caret () in the cell and select a predefined value from the dropdown.

Customize data entry permission on input tables  
Suggest Edits  
Data entry permission allows you to control who can edit input table data and when. For individual input tables, you can specify which workbook version (draft or published) allows users to add rows and edit cell values.

This document explains how to change the data entry permission on individual input tables.

System and user requirements  
The ability to configure data entry permission on input tables requires the following:

Your organization must be connected to a data platform compatible with input tables. See Supported regions, data platforms, and features.  
You must be granted Can use data permission for a connection with write access enabled. If using an OAuth-enabled connection, see Configure OAuth with write access for additional requirements.  
You must be assigned an account type with the Create input tables and Create, edit, and publish workbooks permissions enabled.  
You must be the workbook owner or be granted Can edit workbook permission.  
Set the data entry permission  
Set the data entry permission on an individual input table to specify which workbook version (draft or published) allows users to add rows and edit values to that specific input table.

📘  
The ability to create and build input tables is always restricted to the draft version, meaning only users granted Can edit workbook permission can add new input tables to the workbook and modify the table structure. By default, data entry is also limited to the draft version of the workbook, but you can change the permission on individual input tables to instead allow edits in the published version. When an input table is editable in the published version, users with either Can explore or Can edit workbook permission can interact with the input table data.

For more information about the data entry workflow in a workbook draft versus the published version, see Edit existing input table columns.

Open the draft version of the workbook containing the input table you want to update.

In the input table element, click the Editable in label and select one of the following options from the dropdown:

Only editable in draft	Allows users granted Can edit workbook permission to edit input table data in the draft version of the workbook.  
Only editable in published version	Allows users granted Can explore or Can edit workbook permission to edit input table data in the published version of the workbook, including custom views.  
📘  
You can toggle data entry between the draft and published versions as needed, but the workbook cannot support data entry in both simultaneously.

Before you publish the workbook with the updated data entry permission, the input table element displays a Pending publish notification to indicate that the selected permission is not yet in effect. To apply the data entry permission update, click Publish in the workbook header.

Add system-generated columns to input tables  
Suggest Edits  
Add system-generated columns to input tables to expose metadata for auditing and other data management processes.

Row edit history: Records the timestamp and user email address associated with each row's creation or most recent update.  
Row ID: Populates unique row identifiers that support data management and referential integrity.  
This document explains how to add system-generated row edit history and row ID columns to input tables. For information about other input table data governance options, see Configure data governance options for input tables.

Add row edit history  
Add columns containing row edit history to provide data transparency and promote accountability. Row edit history columns track the timestamp and user email associated with row edits that occur through direct input and actions.

Click the plus () icon at the end of the column header, then hover over Row edit history and select an option:

Last updated at	Date and time the most recent edit was applied to the row.  
Last updated by	Email address of the user who applied the most recent edit to the row.  
Created at	Date and time the row was added to the input table.  
Created by	Email address of the user who initially added the row to the input table.

The column populates the edit history for all existing rows in the input table.

📘  
When a user duplicates an input table, all row edit history (Created at/by and Last updated at/by) in the copy initially reflects the time of the duplication and the user who initiated it.

Add row ID  
Add a column containing row IDs to establish a primary key that uniquely identifies each row in the input table.

📘  
System-generated row IDs are irrelevant to linked input tables and only available for empty and CSV input tables.

Click the plus () icon at the end of the column header, then select Row ID.

The column populates a unique ID for all existing rows in the input table, including empty rows.

📘  
When a user duplicates an input table, Sigma preserves the row IDs for existing rows, resulting in identical IDs in the original and copy. For new rows added after duplication, however, Sigma generates unique IDs.

Intro to layout elements  
Suggest Edits  
Layout elements are dynamic workbook elements that separate, group, and manage the visibility of other workbook elements. They allow you to design user-friendly layouts and build intuitive workflows for a wide variety of use cases.

Use layout elements to organize existing elements on a single page, or combine them with actions to hide and display multiple layers of content across pages, tabs, and pop-ups.

This document introduces the fundamentals of layout elements such as functionality, types, and use cases.

Layout element functionality  
Layout elements allow you to do the following:

Group elements together  
Separate unrelated elements on the same page  
Style elements as a group  
Direct user attention to a required filter or option  
Manage user workflows for data entry  
Reduce visual clutter from multiple filters and controls  
Types of layout elements  
Sigma offers the following types of layout elements:

Containers  
Tabbed containers  
Modals  
Popovers  
Containers  
Containers are customizable elements that can group several elements on a page. You can place a container around existing elements, or you can move individual elements in and out as needed. They allow you to manage a page’s layout and to style elements as a group.

Tabbed containers  
Tabbed containers are used to group elements like a standard container, but they also offer the ability to move between multiple tabs of content. You can navigate between the tabs using the provided controls, or you can hide the controls and use actions to move between tabs.

Modals  
Modals are page-like elements that are displayed as an overlay on your workbook. You can configure a modal to be opened or closed by an action, overlaying the current page and directing the user to interact with the modal’s contents.

Popovers  
Popovers are smaller layout elements that are anchored to a trigger button. You can group multiple filters or controls inside a popover, reducing visual clutter.

Popovers are similar to modals, but differ in two key ways:

Popovers are always anchored to a trigger button  
Popovers are less disruptive to user attention, as they do not obscure the current page  
Example use cases  
Each layout element serves a specific purpose when adding interactivity to a workbook. Containers, for example, are excellent for organizing a single page of content. But, if you were struggling to fit many elements on a page, a container wouldn't help as much as a tabbed container or modal. This is because tabbed containers and models both create new workbook space where you can place elements, and containers do not.

Consider the following use case examples as you decide which layout element suits your needs.

Separate metrics on a dashboard with containers  
Containers allow you to group elements together on a page. When using one workbook page to display two separate metrics, you can group the elements associated with each metric into their own container.

By creating a visual division between the elements and applying styles like a background color to each container, you can make it obvious to users which elements are referencing each metric at first glance.

In this example, KPIs and charts for profit and order volume are separated into their own containers.

A screenshot of a business intelligence dashboard in Sigma. On the left, a charts and KPIs about profit are grouped in an orange container. On the right, charts and KPIs about order volume are grouped in a blue container.

Handle multiple user inputs with a modal  
Modals allow you to obscure the current page, and supply a new set of contents for users to interact with. When using a data app to capture user inputs, you can use a modal to direct their attention towards required inputs. By configuring an Open Modal action on a button click, you can further streamline user interaction with your data app.

In this example, a Project Tracker data app allows end users to enter information about new projects. The Create Project button is configured to open a modal where they can enter the required information, and then click insert a new row based on the information they entered in the modal.

Use containers to organize workbook layouts  
Suggest Edits  
Add a container to your workbook page to organize elements on the canvas and visually group elements together. With containers, you can more easily manage layouts and style elements as a group.

Containers are a layout element, allowing you to guide users and create focused interfaces as you build data apps in Sigma.

A user clicks and drags their cursor around multiple elements in Sigma and selects create container, placing them in a new container together.  
Use containers when you want to:

Create an obvious visual connection between a chart and its filters/controls.  
Separate one group of elements from another on the same page.  
Move multiple elements at the same time.  
Prerequisites  
You must be the owner or have Can edit or Can explore permissions on the workbook.  
Add a container to a workbook  
You can add an empty container or add a container around existing elements:

Add an empty container  
Add a container around existing elements  
Add an empty container  
In the Add element bar, select Layout then Container.  
Select any element from the Add element bar, then drag it into the container.  
Add a container around existing elements  
There are multiple ways to add a container around existing elements:

Drag to select multiple elements, then click Create container () or press ctrl/cmd+g.  
Cmd/ctrl+click to select multiple elements, then click Create container () or press ctrl/cmd+g.  
The container is created on the canvas and selected by default.

Select multiple elements by holding cmd or ctrl while clicking on them, then select create container to put all selected elements in a new container.  
📘  
When you nest containers or tabbed containers, you can only nest four levels deep. If you attempt to place a container inside another layout element that is already nested within three surrounding container or tabbed container elements, Sigma shows a "Cannot nest more than 4 levels of layouts" error.

Customize a container  
To customize the location, size, and style of a container, see the following sections:

Move a container  
Resize a container  
Change the layout grid density of a container  
Style a container  
Move a container  
To change the location of a container and its elements, select the edge of the container to select the container, then drag the container to the new location.

Resize a container  
By default, a container has a grid width of 12, which you can resize as needed. Drag the edges of a container to resize it.

You cannot resize a container smaller than the elements inside of it.  
When you resize a container horizontally, the width of the grid spaces inside the container change and the elements inside the container are resized horizontally to fit.  
When you resize a container vertically, the number of vertical grid spaces inside the container changes but elements do not resize automatically.  
Change the layout grid density of a container (Beta)  
🚩  
This documentation describes a public beta feature and is under construction. This page should not be considered part of our published documentation until this notice, and the corresponding Beta flag on the feature in the Sigma service, are removed. As with any beta feature, the feature discussed below is subject to quick, iterative changes. The latest experience in the Sigma service might differ from the contents of this document.

Beta features are subject to the Beta features disclaimer.

A container has its own grid, similar to the grid on the canvas. By default, a container's grid has 12 horizontal grid spaces, or 12 "columns", which expand and contract to fit the container size. You can change this density in the Properties tab of the editor panel using the Layout grid density setting.

💡  
High density means more (and narrower) columns, which allows more elements to fit side by side with finer control over their widths. Low density means fewer (and wider) columns, which prevents overcrowding and ensures visibility of element content when the browser window width is reduced.

A container with Low column density has 6 grid columns.  
A container with Medium column density has 12 grid columns. This is the default density.  
A container with High column density has 24 grid columns. When dragged to the full width of the canvas, the grid within a container with high column density aligns with the full canvas grid.  
Style a container  
In the editor panel, select Format to style your container:

Style	Details  
Spacing	Specify the amount of space to include between elements in the container. If padding is turned on, the spacing setting also determines the amount of padding.  
Padding	Adds padding to the container. On by default. Turn the toggle off to remove padding between elements and the container.  
Background color	Select a background color for the container.  
Border	Specify a border for the container. Defaults to none, but can be set to 1, 2, or 3 pixels. You can also choose a color for the border.  
Corner	Choose a corner shape for the container. Choose between square, round, and pill. Defaults to round.  
Element gap	Adds padding between elements in the container. On by default. Turn the toggle off to remove padding between elements.  
Remove or delete a container  
To remove a container around elements, select the enclosing container, then select More \> Remove container. The container is removed and any elements inside the container are placed on the canvas. Elements keep the same formatting.

You can also delete a container and all elements inside the container. To do so, select the enclosing container, then select More \> Delete container. The container and all elements inside are deleted.

Use tabbed containers to organize workbook content  
Suggest Edits  
Add a tabbed container to your workbook pages when you want to offer multiple sets of content in the same section of your workbook canvas. A tabbed container works just like a regular container when it comes to organizing, grouping, and managing workbook elements. In addition, a tabbed container has multiple tabs, which can either be visible at the top of the container or hidden for end users. By placing content on different tabs and configuring logic about which tab should display, you can allow users to experience different views in the same space without scrolling or navigating elsewhere.

Tabbed containers are a layout element, allowing you to guide users and create focused interfaces as you build data apps in Sigma.

Gif of a container with three tabs along the top, showing the mouse clicking between two of the tabs to change which one is displayed.  
Use tabbed containers when you want to:

Show a chart and its underlying data in the same dashboard space.  
Show different charts based on the number of selected items in a control.  
Show a custom “No data” message for an empty element.  
Create a drill down that changes from one chart type to another.  
Limitations  
Hiding individual tabs is not supported. You can show or hide the entire tab bar, but not individual tabs. If you hide the tab bar, the only way to display tabs other than the default tab is through the Select tab action. See Create actions that modify or refresh elements.  
When exporting from a workbook with a tabbed container, the export always renders the first tab, which is labeled as the default tab in the properties tab of the editor panel.  
When you nest containers or tabbed containers, you can only nest four levels deep. If you attempt to place a tabbed container or container inside another layout element that is already nested within three surrounding container or tabbed container elements, Sigma shows a "Cannot nest more than 4 levels of layouts" error.  
Prerequisites  
You must be the owner or have Can edit or Can explore permissions on the workbook.  
Add a tabbed container to a workbook  
In edit or explore mode, follow these steps to add a tabbed container:

In the Add element bar, select Layout then select Tabbed container.

An empty tabbed container appears. If you selected a container or tabbed container before adding the element, the new tabbed container is nested within that element. Otherwise, the tabbed container appears on the canvas.  
💡  
To quickly size the container to match the width of other elements already on your canvas, select the element or element you want to match before adding the tabbed container.

The tabbed container appears on your canvas near the elements you selected and matches their width.

Customize a tabbed container  
To customize the tab controls, container layout, and style, see the following sections:

Configure a tabbed container  
Resize a tabbed container  
Change the grid column density of a tabbed container  
Style a tabbed container  
Configure a tabbed container  
When you first add a tabbed container to a workbook, it contains three empty tabs named Tab 1, Tab 2, and Tab 3\.

To customize the configuration of your tabbed container, use the Properties tab of the editor panel:

To rename your tabs, in the Properties tab, double-click on the default tab names. Or, click  More, then click Rename.  
To reorder your tabs, click the drag handle to the left of the tab name in the Properties tab, then drag it to your preferred location in the list.  
📘  
The first tab in your container is the default tab. The default tab is what displays when a user accesses your workbook in view or explore mode, unless you have configured logic to override this default. To configure specific tabs to open based on conditions or user actions, see Create actions that modify or refresh elements.

When exporting from a workbook with a tabbed container, the export always renders the default tab.

To duplicate a tab and all of its contents, click More, then click Duplicate.  
To configure different tabs to display based on user actions, configure the Select tab action. See Create actions that modify or refresh elements.  
Resize a tabbed container  
By default, a tabbed container has a grid width of 12, which you can resize as needed. Drag the edges of a container to resize it.

You cannot resize a container smaller than the elements inside of it.  
When you resize a container horizontally, the width of the grid spaces inside the container change and the elements inside the container are resized horizontally to fit.  
When you resize a container vertically, the number of vertical grid spaces inside the container changes but elements do not resize automatically.  
All tabs in a tabbed container share the same width and height. This means that if you add an element in one tab that takes up more vertical space than the elements on other tabs, the height of all tabs is affected.  
Change the grid column density of a tabbed container (Beta)  
🚩  
This documentation describes a public beta feature and is under construction. This page should not be considered part of our published documentation until this notice, and the corresponding Beta flag on the feature in the Sigma service, are removed. As with any beta feature, the feature discussed below is subject to quick, iterative changes. The latest experience in the Sigma service might differ from the contents of this document.

Beta features are subject to the Beta features disclaimer.

A container has its own grid, similar to the grid on the canvas. By default, a container's grid has 12 horizontal grid spaces, or 12 "columns", which expand and contract to fit the container size. You can change this density in the Properties tab of the editor panel using the Column density setting.

💡  
High density means more (and narrower) columns, which allows more elements to fit side by side with finer control over their widths. Low density means fewer (and wider) columns, which prevents overcrowding and ensures visibility of element content when the browser window width is reduced.

A container with Low column density has 6 grid columns.  
A container with Medium column density has 12 grid columns. This is the default density.  
A container with High column density has 24 grid columns. When dragged to the full width of the canvas, the grid within a container with high column density aligns with the full canvas grid.  
Style a tabbed container  
In the editor panel, select the Format tab to style your container:

Style	Details  
Spacing	Specify the amount of space to include between elements in the container. If the tab bar is visible, the spacing setting also changes the amount of space between the top of the tabbed container and the tab bar. If padding is turned on, the spacing setting also determines the amount of padding.  
Padding	Adds padding to the tabbed container. Selected by default. Deselect the checkbox to remove padding between the outside edges of elements and the container.  
Background color	Select a background color for the tabbed container.  
Border	Specify a border for the tabbed container. Defaults to none, but can be set to 1, 2, or 3 pixels. You can also choose a color for the border.  
Corner	Choose a corner shape for the tabbed container. Choose between square, round, and pill. Defaults to round.  
Element gap	Adds padding between elements in the tabbed container. Selected by default. Deselect the checkbox to remove padding between elements.  
Open the Tab bar style section to style the tab bar:

Style	Details  
Show tab bar	Turn off the toggle to hide the tab bar from end users in view mode and explore mode. By default, the tab bar is visible. If you hide the tab bar, the only way to display tabs other than the default tab is using the Select tab action. See Create actions that modify or refresh elements .  
Tab style	Select Open, Box, or Button. The default style is Open.  
Alignment	Select  Left, Center,  End, or Justify to specify how the tabs should be aligned in the tab bar. The default alignment is Left.  
Size	Select a size for the tabs, Small, Medium, or Large. The default size is Medium.  
Remove or delete a tabbed container  
When you delete a tabbed container, you also delete all elements inside every tab of the tabbed container. To do so, select the tabbed container, then select More \> Delete element. The tabbed container and all elements inside are deleted.

Use modals to create focused content views  
Suggest Edits  
Modals help simplify workbook design and allow you to build a streamlined, app-like experience. An open modal overlays and obscures a workbook page to provide a focused view of the modal content. This reduces visual clutter and allows you to present form fields, provide customized drilldowns, display controls and filters in a dedicated container, etc.

Modals are a layout element, allowing you to guide users and create focused interfaces as you build data apps in Sigma.

Modal titled Create Project with 4 input controls for project name, project type, project status, and project due date shown overlaying a workbook page called project status tracker  
Use modals when you want to:

Spotlight a particular element or set of elements.  
Add elements to a dashboard without creating an additional page.  
Provide an app-like experience for user data entry.  
This document explains how to create and customize modals. To incorporate a modal into a workbook, you must configure an Open modal action. For more information about using this action, see Create actions that navigate to destinations.

User requirements  
The ability to create and modify modals requires the following:

To use this feature, you must have Can edit or Can explore access to the individual workbook.  
You must be in Edit or Explore mode for the workbook. See workbook modes overview.  
Add a modal to your workbook  
There are several ways to add a modal to a workbook, including the following:

In the Add element bar, select Layout and then select Modal.  
In the workbook footer, select the down arrow (), then select Add modal.  
Add modal option as a caret next to the \+ used to add a page.  
Create a new modal while moving an existing element. In the element toolbar, select More, then select Move to \> New modal from the dropdown.  
Create a workbook action to open a modal. In the Select modal field, choose New modal.  
A modal appears as a new hidden page tab for the workbook, with a predefined size. Add elements and customize the modal just like a workbook page. All element types are supported, but consider the modal size and layout when adding elements.

By default, a modal includes a default title and primary and secondary buttons. To customize the appearance of the modal, see Customize a modal.

You can optionally rename the modal to keep your workbook organized. In the modal page tab, select the down arrow (), then select Rename or double-click the modal tab to rename it. The modal name is separate from the title that appears on the modal.

Customize a modal  
Customize the appearance of a modal to match the use case. For example, a modal that displays documentation might not need buttons, and a modal that modifies a workbook page might benefit from dynamic text formatting in the title.

By default, a modal includes a header with a title and a close icon, and a footer with two buttons. You cannot place additional elements in the header or footer, but you can customize the display and hide both the header and the footer, including the buttons.

To customize the appearance and feature of a modal, see the following sections:

Customize modal appearance  
Add a title to the modal  
Customize the footer and buttons on the modal  
Customize modal appearance  
You can customize the width of the modal and the spacing of elements on the modal. You can also choose to show padding and a gap between elements. If desired, add a background color to the modal. The background color does not apply to the footer of the modal.

To customize the width of the modal:

Select the modal on the workbook page.  
In the editor panel, select a Width. By default, the modal width is Small. Choose between Extra small, Small, Medium, Large, and Extra large.  
To customize the appearance of the modal, including elements added to it:

Select the modal on the workbook page  
In the editor panel, select Format.  
Click Modal style to expand the section and view the style options:  
Style Details  
Spacing Manage the space around the outside of the modal and between rows. Choose between Small, Medium (default), and Large.  
Padding Adds padding to the modal. Selected by default. Turn off the toggle to remove padding between elements and the modal.  
Background color Select a background color for the modal. Does not apply to the footer.  
Element gap Adds padding between elements. Selected by default. Turn off the toggle to remove all space between elements.  
Add a title to the modal  
By default, a modal includes a header with a default title, New Modal, and a close icon. To hide or modify the title or close icon for the modal:

Select the modal on the workbook page.  
In the editor panel, select Format.  
Click Header to expand the header formatting options.  
(Optional) Turn off Show title to hide the title. Show title is enabled by default.  
If the title is shown, use the text box to add or update the title. Enter an equals sign (=) to use a dynamic text formula. See Add dynamic text based on your data.  
(Optional) To change the title text's formatting, use the formatting tools to add bold, change the text color, or change the text size.  
(Optional) To hide or show the close icon, turn Show close icon on or off.  
Hiding both the title and the close icon hides the header.

Customize the footer and buttons on the modal  
By default there are two buttons in the footer, labeled Primary and Secondary to align with the color styling. You can also add custom buttons to the modal outside of the footer using the Add element bar.

To customize the primary or secondary buttons:

Select the modal on the workbook page.  
In the editor tab, select Format.  
Click Footer to expand the footer formatting options.  
(Optional) To hide the primary button, turn off Show primary button.  
For Text, use the text box to update the placeholder text to a specific call to action. For example, Submit or Acknowledge.  
(Optional) To hide the secondary button, turn off Show secondary button.  
For Text, use the text box to update the placeholder text to a secondary call to action. For example, Cancel or Clear.  
Hiding both buttons hides the footer.

Delete a modal  
To delete a modal, click the caret () in the tab to open the modal menu, then select Delete.

Deleting a modal deletes all elements inside the modal.

A screenshot of the modal menu that appears when selecting the caret next to that modal. Options read "Delete, Rename, Change Color, Duplicate, and Copy page"

Use popovers to simplify a workbook interface  
Suggest Edits  
Use popovers to display contextual information (tables, charts, filters, text, etc.) in floating containers anchored to specific trigger buttons. Popovers open on demand without obscuring the rest of the workbook page, which can help create a more efficient and simplified workbook interface.

Popovers are a layout element, allowing you to guide users and create focused interfaces as you build data apps in Sigma.

Image of a popover trigger button and an open popover containing three control filters

Use a popover when you want to:

Display multiple filters for one table with a single button.  
Reduce visual clutter by grouping filters, controls, and buttons.  
Provide additional functionality to a user without navigating them away from the current page.  
To create a floating container that obscures the workbook page, and that isn't anchored to workbook elements, see Create and customize modals.

User requirements  
The ability to create and customize a popover requires the following:

You must be assigned an account type with the Create, edit, and publish workbooks permission enabled.  
You must be the workbook owner or be granted Can edit access to the workbook.  
Limitations  
Sigma does not currently support nesting popovers inside other popovers. Popovers can, however, be nested inside modals.

Create a popover  
To create a popover, first add a Popover element to your workbook.

Open a workbook draft.

In the Add element bar, select Layout, then select Popover.

Image of the Add elements bar with the Layout \> Popover option highlighted for selection

Sigma adds the two popover components described below and identified in the following screenshot:

Trigger button: Opens the popover.

Popover configuration page: Allows you to customize the content, properties, and style of the popover. The configuration page and corresponding tab are visible in the workbook draft only.

Image of a workbook with annotations pointing to the popover button in the workbook page and the popover configuration page tab in the workbook footer

Customize a popover  
To customize the content, width, or style of a popover, see the following sections:

Add or edit the popover content  
Change the popover width  
Customize the popover style  
Add or edit the popover content  
Add or edit contextual information to display in the popover.

Select the tab for the popover configuration page.

Use the Add element bar to add elements in the same way you would add them to a workbook page. You can include any data, input, chart, control, UI, or layout element with the exception of popovers. Sigma does not support nested popovers.

Image of the popover configuration page displaying the popover container, editor panel, and the Add element bar with the Controls option highlighted for selection

Change the popover width  
Adjust the width of the popover to accommodate its contents and placement in the workbook.

Select the tab for the popover configuration page.

In the editor panel, select the Properties tab.

In the Width dropdown, select an option to adjust the width of the popover.

Image of the editor panel open to the Properties tab with the Width dropdown field selected and open

Customize the popover style  
Configure the popover spacing, padding, background color, and element gap.

Select the tab for the popover configuration page.

In the editor panel, select the Format tab.

Expand the Popover style section to view the style settings.

Configure the style settings:

Spacing: Select the size of the padding and element gap.

Padding: Enable or disable the space between the border of the popover and its content.

Background color: Select the color displayed behind the elements in the popover.

Element gap: Enable or disable the space between elements in the popover.

Image of the editor panel open to the Format tab with the Popover style section expanded to display all popover style settings

Customize a popover trigger button  
Customize the trigger button that the popover is anchored to. You can configure properties that define the button's appearance, including the label, style, alignment, shape, and size.

To navigate directly to the trigger button:

Select the tab for the popover configuration page.

In the editor panel, select the Properties tab.

In the Trigger button section, click Edit.

Image of the editor panel open to the Properties tab with the trigger button Edit option highlighted for selection

Sigma opens the workbook page containing the trigger button and automatically opens the button properties in the editor panel.

In the editor panel, configure the button properties:

Appearance: Select a button variant.

Text: Add a label or call to action (CTA) to display in the button. Enter \= to include a dynamic value defined by a formula expression.

Style: Customize the font weight, text color, and button color.

Horizontal: Align or stretch the button relative to the total element width. The popover mirrors the alignment setting of the button. I.e. a left-aligned button opens a left-aligned popover.

Vertical: Align the button relative to the total element height. The popover mirrors the alignment setting of the button. I.e. a top-aligned button opens a popover above the button as long as there is enough space onscreen.

Shape: Select a button shape.

Size: Select a button size.

Show filter count: Select the checkbox to display the number of active filters originating from the popover. An active filter is any control element in the popover that has been modified from its default value.

Image of a workbook page containing the popover trigger button, with the popover button properties displayed in the editor panel

Delete a popover  
Use one of the following methods to delete a popover, including its trigger button, configuration page, and all elements within the popover.

Delete a popover from the trigger button  
Delete a popover from the configuration page tab  
Delete a popover from the trigger button  
Open the workbook page containing the trigger button.

Hover over the trigger button, then click More.

In the element menu, select Delete element.

Delete a popover from the configuration page tab  
In the popover configuration page tab, click the down arrow ().  
In the page menu, select Delete.j

Intro to actions  
Suggest Edits  
Actions are user-defined interactivity that you can configure within and across workbook elements. By automating responses to specific user interactions, you can create efficient workbook workflows that produce quick and relevant data insights.

This document introduces action conditions, triggers, and effects. For information about using actions, see the Related resources section at the end of this page.

Understanding actions  
An individual action consists of a condition (optional), a trigger, and an effect.

Condition (optional) A rule that determines when an action or sequence of actions1 executes.  
Trigger A user interaction with a specific element (the trigger element) that initiates the response of one or more actions or sequences of actions.  
Effect The defined response to the user interaction.  
1  
You can configure a single action on a workbook element or a sequence of multiple actions that execute in a specified order.

Action conditions  
You can define an optional condition for any action sequence. The condition can be a custom formula or, if you are configuring an action for a control, the condition can be the value of the control.

For more information, see Make an action conditional.

Action triggers  
Action triggers can be configured on most element types. The following table describes the supported trigger types.

📘  
Actions are not initiated when a trigger element is maximized. This behavior prevents users from triggering action effects that are not visible while the maximized element spans the full browser window.

Element type Trigger type (user interaction)  
Table, pivot table, or input table  
On select: User selects a cell in a specific column.

Cell context menu: User selects a custom context menu item on a cell.

Visualization  
On select: User selects a data point or category on the chart.

Cell context menu: User selects a custom context menu item on a data point.

UI element  
(button or image only) On click: User clicks the element.  
Control element On change: User changes the control value.  
Modal  
On click \- primary: User clicks the primary button.

On click \- secondary: User clicks the secondary button.

On close: user clicks the X or clicks outside the modal.

Plugin User-configured interaction. See Configure plugins to use as trigger elements.  
Action effects  
The following table lists the actions you can configure on a trigger element and describes the corresponding effect.

Category Action Effect  
Navigation Open link Navigates to an external link or destination within Sigma.  
Open Sigma doc Navigates to a different Sigma workbook.  
Navigate in this workbook Shifts the focus to the top of a specific page or an individual element in the current workbook.  
Download and export Initiates a direct download or an export to email, Slack, webhook, or cloud storage.  
Controls Set control value Sets the value of a specific control element in the current workbook.  
Clear control Clears the values of a specific control element in the current workbook.  
Elements Modify element Modifies an element's columns, groupings, properties, or axis scale.  
Refresh element  
Refreshes the data of a specific element in the current workbook.

This action doesn’t apply to materialized elements.

Modals and tabbed containers Open modal Opens a modal in the current workbook.  
Close modal Closes an open modal.  
Select tab Displays a tabbed container opened to a specific tab.  
Input tables Insert row Adds a new row to an existing input table.  
Update row Updates row values in an existing input table.  
Delete row Deletes a row in an existing input table.  
Advanced Call stored procedure Calls a stored procedure.  
Generate iframe event (for embedding) Generates an outbound iframe event.  
Trigger plugin Triggers effects within a plugin.  
Action configurations  
Actions feature versatile configurations to support responses that are highly relevant to your specific needs and preferences.

Examples:

Configure the Open URL action to open a static link, or utilize dynamic text to generate URLs that adjust to control or column values in the current workbook.  
Configure the Set control value action to filter the trigger element itself, or create a cross-element action that filters a child element.  
Configure the Open Sigma doc action to open another workbook in its published state, or pass values to control elements in the destination workbook to open a custom, drilled-down view.  
For detailed information about configuring the different types of actions, see the Related resources section at the end of this page.

Create actions that navigate to destinations  
Suggest Edits  
Workbooks support actions that navigate users to predefined URLs, other Sigma documents, or different locations within the current workbook.

This document explains how to create actions that navigate users to specific destinations. For more information about actions in Sigma, see Intro to actions.

User requirements  
📘  
The following requirements apply to users who configure actions. Users who access and interact with a workbook can typically trigger all existing actions within it. Any restrictions are noted in this document.

The ability to configure actions requires the following:

You must be assigned an account type with the Full explore or Create, edit, and publish workbooks permission enabled.

You must be the workbook owner or be granted Can explore1 or Can edit workbook permission.

1  
If you’re granted Can explore workbook permission, you can configure actions in custom, saved, and shared views. Actions saved to views do not apply to the workbook’s published version.

Open a link  
Create an action that navigates to an external link or destination within Sigma. Open a static link or generate a dynamic URL that adjusts to control or column values in the current workbook.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Open link.  
Link URL  
Enter the URL of an external webpage or destination within Sigma.

For information about using dynamic text in the URL, see Create a dynamic URL in this document.

Open in  
Select an option to determine how the link opens in the browser.

New window: Opens the link in a new browser window.  
Same window: Opens the link in the current browser window when the user interacts with the trigger element directly in Sigma.  
Parent window: Opens the link in the current browser window when the user interacts with the trigger element in an embed.  
The interacting user’s browser settings may change the selected Open in behavior. For example, New window may instead open the URL in a new tab (same window), and Same window may instead open the URL in the same tab.

If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Open a link with a dynamic URL  
To generate a dynamic URL that adjusts to control or column values in the current workbook, utilize Sigma’s dynamic text functionality when configuring the Link URL field in step 4 of the previous section.

In the Link URL field, enter the base URL (unless this must also be dynamically generated), then enter \= anywhere you want to add a dynamic value.

When you enter \= , Sigma immediately displays an overlay containing a formula bar.

To pass the value of a control, enter a control ID in square brackets: \[\<control-ID\>\]. For example, \[search-control\].  
To pass the selection that was made in a column, add a variable that references the selection: \[Selection/\<Column Name\>\]. For example, \[Selection/Name\]. See Use variables in actions.  
To pass all values in a column, enter the column name of an element enclosed in square brackets: \[\<Element name\>/\<Column name\>\]. For example: \[Vendors/Portal\]  
You can also apply functions to generate dynamic values or to transform control and column values as needed.

Open a workbook or template  
Create an action that navigates to another Sigma workbook or template. Open the destination document in its published state, or pass specific values to existing control elements to instantly open a drilled-down view.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Open Sigma doc.  
Destination  
Select a workbook or template to open.

Interacting users can only view the destination document if granted permission to access it.

Pass control values See Pass values to controls in the destination workbook in this document.  
Open in  
Select an option to determine how the workbook or template opens in the browser.

New window: Opens the document in a new browser window.  
Same window: Opens the the document in the current browser window when the user interacts with the trigger element directly in Sigma.  
Parent window: Opens the document in the current browser window when the user interacts with the trigger element in an embed.  
The interacting user’s browser settings may change the selected Open in behavior. For example, New window may instead open the workbook or template in a new tab (same window), and Same window may instead open it in the same tab.

If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Pass values to controls in the destination workbook  
To open a drilled-down view of the destination workbook, add control targets and rules to the Pass control values field in step 4 of the previous section.

In the Pass control values section, click Add a control target.

Configure the required fields to identify the control target and define the rule:

Update control Select a control element to update in the destination workbook.  
Set value as  
Select an option to determine the type of value Sigma passes to the control, then define the value.

Specific values: Passes the specified (fixed) value.  
Values from a column: Passes values from the specified column in the trigger element’s underlying data (if applicable).

Only available when the trigger element is a table, pivot table, input table, or visualization.

Custom formula: Passes a value based on the defined formula.  
\[optional\] Repeat steps 1 and 2 to configure additional control targets and rules.

Navigate the current workbook  
Create an action that navigates to a specific location within the current workbook. Shift the focus to the top of a page or to an individual element.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Navigate in this workbook.  
Destination Select the page or element to focus on in the workbook view  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.

Create actions that manage control values  
Suggest Edits  
Workbooks support actions that set or clear values of specific control elements, enabling interacting users to quickly filter and unfilter data for different focused views.

This document explains how to create actions that manage control values. For more information about actions in Sigma, see Intro to actions.

User requirements  
📘  
The following requirements apply to users who configure actions. Users who access and interact with a workbook can typically trigger all existing actions within it. Any restrictions are noted in this document.

The ability to configure actions requires the following:

You must be assigned an account type with the Full explore or Create, edit, and publish workbooks permission enabled.

You must be the workbook owner or be granted Can explore1 or Can edit workbook permission.

1  
If you’re granted Can explore workbook permission, you can configure actions in custom, saved, and shared views. Actions saved to views do not apply to the workbook’s published version.

Set a control value  
Create an action that sets the value of a specific control element in the current workbook.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Set control value.  
Update control Select a target control element to update in the current workbook.  
Set value as  
Select an option to determine the type of value Sigma passes to the target control, then define the value.

Static values: Passes the specified (fixed) value.  
Column: Passes values from the specified column in the trigger element’s underlying data (if applicable).

Only available when the trigger element is a table, pivot table, input table, or visualization.

Control: Passes the value selected on the specified source control.  
Formula: Passes a value based on the defined formula.  
Set control selection to  
Select an option to determine how the interaction affects the target control value.

Replace previous selection: The value passed to the control replaces all selected values. Any value previously selected is removed from the control selection.  
Add to existing selection: The value passed to the control is added to currently selected values.

Remove from existing selection: The value passed to the control is removed from the selected values.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Clear one or more control values  
Create an action that clears the values of one or more control elements in the current workbook.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Clear control.  
Apply to Select the scope of the action to clear controls at one of the following levels of granularity: Specific control, Container, Tabbed container, Page / modal, or Entire workbook.  
Control, Container, Tabbed container, or Page / modal Depending on your selection in the Apply to field, specify the target control, container, tabbed container, page, or modal from the dropdown. If you selected Entire workbook in the Apply to field, this field does not apply.  
Tab If you selected Tabbed container in the Apply to field, select one or all tabs containing the controls you want to clear.  
Reset to published value \[optional\] Select the checkbox to reset the control values to the last published values. On a tagged version of a workbook, this setting resets to the tagged version's values.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.

Create actions that modify or refresh elements  
Suggest Edits  
Workbooks support actions that determine column visibility, update element groupings and properties, change axis scales, refresh data, and select tabs in tabbed containers. These actions enable interacting users to quickly view and drill into different underlying data segments, tailor chart presentations, and ensure elements display the most up-to-date data.

This document explains how to configure the Modify element, Refresh element, and Select tab actions. For more information about actions in Sigma, see Intro to actions.

User requirements  
📘  
The following requirements apply to users who configure actions. Users who access and interact with a workbook can typically trigger all existing actions within it. Any restrictions are noted in this document.

The ability to configure actions requires the following:

You must be assigned an account type with the Full explore or Create, edit, and publish workbooks permission enabled.

You must be the workbook owner or be granted Can explore1 or Can edit workbook permission.

1  
If you’re granted Can explore workbook permission, you can configure actions in custom, saved, and shared views. Actions saved to views do not apply to the workbook’s published version.

Modify elements  
The Modify elements action supports the following effects:

Show columns  
Hide columns  
Move columns  
Swap columns  
Set axis scale  
Show columns  
Create an action that shows columns (ungrouped only) in the target element. Columns can be shown based on a static selection or when column names match selected control values in the trigger element.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Modify element.  
Target element Select an element to modify.  
What to modify  
Select Show columns, then choose one or more columns to show in the target element.

If the trigger element is a List values or Segmented control, choose an option in the secondary field:

From a static selection: Allows you to select specific columns to show in the target element.

When you choose All columns, user interaction triggers the target element to show all columns that existed at the time you configured the action. To show columns added post-configuration, you must update the action.

With names matching control values: Dynamically shows columns in the target element when the column names match selected control values in the trigger element.

When a user interacts with the control, the target element shows all columns with names that match selected control values (selected checkboxes in a List values control, or the selected segment in a Segmented control) and hides all columns with names that match unselected control values (cleared checkboxes in a List values control, or unselected segments in a Segmented control). Columns with names that don't match any control values are unaffected by the action and may be shown or hidden based on other configurations and actions.

Hide unselected columns Select the checkbox to hide the remaining columns (not selected in the What to modify field), or keep the checkbox clear to continue showing all columns already displayed in the target element.  
💡  
To set column names as the control values, use one of the following methods:

Enter column names in an input table column, then select that column as the control element's value source.  
Create a manual list of column names as the control element's values source.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Hide columns  
Create an action that hides columns (ungrouped only) in the target element. Columns can be hidden based on a static selection or when column names match selected control values in the trigger element.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Modify element.  
Target element Select an element to modify.  
What to modify  
Select Hide columns, then choose one or more columns to hide in the target element.

If the trigger element is a List values or Segmented control, choose an option in the secondary field:

From a static selection: Allows you to select specific columns to hide in the target element.

When you choose All columns, user interaction triggers the target element to hide all columns that existed at the time you configured the action. To hide columns added post-configuration, you must update the action.

With names matching control values: Dynamically hides columns in the target element when the column names match selected control values in the trigger element.

When a user interacts with the control, the target element hides all columns with names that match selected control values (selected checkboxes in a List values control, or the selected segment in a Segmented control) and shows all columns with names that match unselected control values (cleared checkboxes in a List values control, or unselected segments in a Segmented control). Columns with names that don't match any control values are unaffected by the action and may be shown or hidden based on other configurations and actions.

Show unselected columns Select the checkbox to show the remaining columns (not selected in the What to modify field), or keep the checkbox clear to continue hiding all columns already hidden in the target element.  
💡  
To set column names as the control values, use one of the following methods:

Enter column names in an input table column, then select that column as the control element's value source.  
Create a manual list of column names as the control element's values source.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Move columns  
Create an action that moves columns into or out of a table grouping, pivot table property (row, column, or value), or chart property (axis, color, tooltip, etc.) in the target element. Columns can be moved based on a static selection or when column names match selected control values in the trigger element.

📘  
If the target element is a table, the Move columns option is only available when the table contains existing groupings.

If the target element is a pivot table or chart, the action doesn't remove an existing column from the target property unless the property only supports one column.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Modify element.  
Target element Select an element to modify.  
What to modify  
Select Move columns, then select a grouping or property from the target element.

The to base option moves a column out of a grouping or property and into the base underlying data. Other available groupings and properties depend on the type of target element selected

Which column  
Most elements only support the From a static selection option, which allows you to choose a specific column to move into or out of the target grouping or property. In these cases, use the secondary field to select the column to move.

If the trigger element is a List values or Segmented control, you can choose the Column names matching control values option to dynamically move columns when their names match selected control values in the trigger element. When you choose this option, all columns (in any grouping or property) with names that match unselected control values automatically move to the base underlying data. Columns with names that don’t match any control values are unaffected by the action.

💡  
To set column names as the control values, use one of the following methods:

Enter column names in an input table column, then select that column as the control element's value source.  
Create a manual list of column names as the control element's values source.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Swap columns  
Create an action that swaps all columns of a table grouping, chart property (axis, color, tooltip, etc.), or pivot table property (row, column, or value). This action removes all existing columns in the target grouping or property and replaces them with the selected column.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Modify element.  
Target element Select an element to modify.  
What to modify Select Swap columns, then select a grouping or property from the target element.  
Swap with Select a column to replace the existing columns in the target grouping or property.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Set axis scale  
Create an action to set the scale of the dependent variable (or value) axis in the target element.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Modify element.  
Target element Select an element to modify.  
What to modify Select Set axis scale.  
Scale type Select an option to determine the scale type applied to the target element’s dependent variable (or value) axis.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Refresh an element  
Create an action to refresh the data of a target element in the current workbook. Refreshing a parent element also refreshes all child elements in the workbook.

🚧  
This action doesn’t refresh the data if the element is materialized.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Refresh element.  
Element Select an element to refresh.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Select tab  
Create an action to display a specific tab in a tabbed container element.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Select tab.  
Tabbed container Select a tabbed container in this workbook.  
Tab Select the tab to display.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.

Create actions that control modals and tabbed containers  
Suggest Edits  
Workbooks support actions that change the state of modals and tabbed containers, enabling seamless transitions between related content views.

This document explains how to create actions that open modals, close modals, or select a specific tab in a tabbed container. For more information about actions in Sigma, see Intro to actions.

User requirements  
📘  
The following requirements apply to users who configure actions. Users who access and interact with a workbook can typically trigger all existing actions within it. Any restrictions are noted in this document.

The ability to configure actions requires the following:

You must be assigned an account type with the Full explore or Create, edit, and publish workbooks permission enabled.

You must be the workbook owner or be granted Can explore1 or Can edit workbook permission.

1  
If you’re granted Can explore workbook permission, you can configure actions in custom, saved, and shared views. Actions saved to views do not apply to the workbook’s published version.

Open or close a modal  
Create an action that opens or closes a modal in the current workbook. For more details about modals, see Add a modal to a workbook.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Open modal or Close modal.  
Select modal  
If configuring an Open modal action, select the modal to open, or choose New modal.

The Close modal action doesn't require modal selection because it must be configured on an element within the modal it closes.

If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Select tab (beta)  
🚩  
This documentation describes a public beta feature and is under construction. This page should not be considered part of our published documentation until this notice, and the corresponding Beta flag on the feature in the Sigma service, are removed. As with any beta feature, the feature discussed below is subject to quick, iterative changes. The latest experience in the Sigma service might differ from the contents of this document.

Beta features are subject to the Beta features disclaimer.

Create an action to display a specific tab in a tabbed container element.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Select tab.  
Tabbed container Select a tabbed container in this workbook.  
Tab Select the tab to display.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.

Create actions that modify input table data  
Suggest Edits  
Workbooks support actions that add, update, or delete rows in input table. These actions are designed to support form functionality but can be used in other ways to accommodate different data app use cases.

This document explains how to configure the Insert row, Update row, and Delete row actions. For more information about actions in Sigma, see Intro to actions.

User requirements  
📘  
The following requirements apply to users who configure actions. Users who access and interact with a workbook can typically trigger all existing actions within it. Any restrictions are noted in this document.

The ability to configure actions requires the following:

You must be assigned an account type with the Full explore or Create, edit, and publish workbooks permission enabled.

You must be the workbook owner or be granted Can explore1 or Can edit workbook permission.

1  
If you’re granted Can explore workbook permission, you can configure actions in custom, saved, and shared views. Actions saved to views do not apply to the workbook’s published version.

Insert row  
Create an action that adds a new row in a target input table.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Field Configuration  
Action Select Insert row.  
Into Select a target input table (empty only) to update with the added row.  
With values  
For each column of your input table, define the value (or source of the value) that Sigma must pass to the row.

The availability of value type options (described below) depend on the elements in the workbook.

Static values: Passes a specified (fixed) value.  
Column: Passes the value of the specified table column.  
Control: Passes the value of the specified control element.  
Formula: Passes a value based on the defined formula.  
To leave a column blank, select Static values and leave the value unset.

If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Confirm that the data entry permission on the input table is set to accept edits in the published version. See Set data entry permission for more information.  
Update row  
Create an action that updates values of an existing row in a target input table.

📘  
The Update row action can only modify input tables created after April 23, 2023\.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Field Configuration  
Action Select Update row.  
In Select a target input table (empty or linked) containing rows to update.  
Which row  
Define the value (or source of the value) that must match the unique identifier of the row to update. This can be the system-generated row ID for an empty input table or the primary key column value in a linked input table.

If the target element is an empty input table that doesn't contain a row ID column, you can add one directly from the modal.

Update with values  
For each column that you want to update in the target input table, define the value (or source of the value) that Sigma must pass to the row.

The availability of value type options (described below) depend on the elements in the workbook.

Static values: Passes a specified (fixed) value.  
Column: Passes the value of the specified table column.  
Control: Passes the value of the specified control element.  
Formula: Passes a value based on the defined formula.  
To leave a column blank, select Static values and leave the value unset.

If a column you want to update isn't listed, click \+ Add column and select it, or click \+ Add all columns. To remove a column that you don't want to update, click x Delete next to the corresponding value field.

If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Confirm that the data entry permission on the input table is set to accept edits in the published version. See Set data entry permission for more information.  
Delete row  
Create an action that deletes an existing row in a target input table.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Field Configuration  
Action Select Delete row.  
In Select a target input table (empty or linked) containing rows to delete.  
Which row  
Define the value (or source of the value) that must match the system-generated row ID of the row to delete.

If the target input table doesn't contain a row ID column, you can add one directly from the Action modal.

If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Confirm that the data entry permission on the input table is set to accept edits in the published version. See Set data entry permission for more information.

Create actions that send notifications and export data  
Suggest Edits  
You can create workbook actions that initiate direct downloads as well as exports to email, Slack channels, Microsoft Teams Channels, Microsoft SharePoint, webhooks, and cloud storage.

For email and Slack, you can create actions that send notifications to users and channels. These notifications can be configured independently of an export, and support both static and dynamic lists of users.

🚩  
This documentation describes a public beta feature and is under construction. This page should not be considered part of our published documentation until this notice, and the corresponding Beta flag on the feature in the Sigma service, are removed. As with any beta feature, the feature discussed below is subject to quick, iterative changes. The latest experience in the Sigma service might differ from the contents of this document.

Beta features are subject to the Beta features disclaimer.

This document explains how to create actions that export workbook content to specific destinations or notify users by Slack and email. For more information about configuring these actions in Sigma, see Intro to actions. For more information on exporting data, see Export data.

User requirements  
📘  
The following requirements apply to users who configure actions. Users who access and interact with a workbook can typically trigger all existing actions within it. Any restrictions are noted in this document.

The ability to configure actions requires the following:

You must be assigned an account type with the Full explore or Create, edit, and publish workbooks permission enabled.

You must be the workbook owner or be granted Can explore1 or Can edit workbook permission.

1  
If you’re granted Can explore workbook permission, you can configure actions in custom, saved, and shared views. Actions saved to views do not apply to the workbook’s published version.

Send notifications by email (Beta)  
Create an action that emails selected recipients, without sending an attachment or export.

📘  
This action can only be configured and triggered by users assigned an account type with the Export to email permission enabled.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Notify and export.  
Destination Select Email.  
Recipient For Specific users / teams, enter one or more comma-separated email addresses for the recipients.

For Dynamic recipients, provide a list of users based on dynamic information from a control or formula. If your action is configured on a table, pivot table, or input table, you can also create a list of dynamic recipients from a column.  
Subject Enter a subject line for the email notification. For dynamic text, press \= on your keyboard to open the formula bar and configure dynamic text.  
Message \[optional\] Enter a message to include in the email body. For dynamic text, press \= on your keyboard to open the formula bar and configure dynamic text. Sigma includes basic information about the sender and workbook in the email body.  
Link to workbook \[optional\] Off by default. Turn the Link to workbook toggle on to include a link to the workbook in the email. When the toggle is turned on, you can select whether to link to the entire workbook (top of page 1), a specific page (top of specified page), or a specific element.  
Attachment Confirm that the Attachment toggle is turned off.  
More options \[optional\] Select the Run queries as recipient checkbox to run workbook queries as the recipient of the email. If deselected (default), queries run as the user who performs the action. When Run queries as recipient is enabled, each query runs separately per recipient. Larger list of recipients result in more queries and longer processing times. Each recipient must be a Sigma user, and the user who performs the action must have an account type with the Run exports as recipient permission enabled.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Send notifications by Slack (Beta)  
Create an action that sends a Slack message to selected recipients, without sending an attachment or export.

To create a Slack notification action, the Slack integration must be enabled for your organization. If you want to send notifications to a private channel, you must also add Sigma to the private channel. See Adding Sigma to a private Slack channel.

📘  
This action can only be configured and triggered by users assigned an account type with the Export to Slack permission enabled.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Notify and export.  
Destination Select Slack.  
To For Specific users / teams, enter a comma-separated list of Slack \#channel-names, channel-ids, or member-ids.

For Dynamic recipients, provide a list of channel names, channel ids, or member ids based on dynamic information from a control or formula. If your action is configured on a table, pivot table, or input table, you can also provide a column that contains a list of channel names, channel ids, or member ids.  
Message \[optional\] Enter a message to include in the Slack notification. For dynamic text, press \= on your keyboard to open the formula bar and configure dynamic text. Sigma includes basic information about the sender and workbook in the message body by default. For more information on formatting a message, such as tagging users, see Format a slack message.  
Link to workbook \[optional\] Off by default. Turn the Link to workbook toggle on to include a link to the workbook in the message. When the toggle is turned on, you can select whether to link to the entire workbook (top of page 1), a specific page (top of specified page), or a specific element.  
Attachment Confirm that the Attachment toggle is turned off.  
💡  
When sending to Slack channels, Sigma recommends using channel ids rather than channel names. For more information, see Format a slack message.

If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Download a file  
Create an action that downloads an entire workbook, a specific page, or an individual element directly to the interacting user’s device.

📘  
This action can only be configured and triggered by users assigned an account type with the Download permission enabled.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Notify and export.  
Destination Select Download.  
Attachment Select the workbook content to download, then choose a file format.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Export to email  
Create an action that emails an entire workbook, a specific page, or an individual element to selected recipients.

To configure a standard export to email that is not managed by a workbook action, see Export to email.

📘  
This action can only be configured and triggered by users assigned an account type with the Export to email permission enabled.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Notify and export.  
Destination Select Email.  
Recipient For Specific users / teams, enter one or more comma-separated email addresses for the recipients.

For Dynamic recipients, provide a list of users based on dynamic information from a control or formula. If your action is configured on a table, pivot table, or input table, you can also create a list of dynamic recipients from a column.  
Subject Enter text to include in the email subject line. For dynamic text, press \= on your keyboard to open the formula bar and configure dynamic text.  
Message \[optional\] Enter a message to include in the email body. For dynamic text, press \= on your keyboard to open the formula bar and configure dynamic text.  
Attachment Confirm that the Attachment toggle switch is on. Select the workbook content to export, then choose a file type.  
More options \[optional\] Select the Include link to workbook checkbox to allow the export recipient to open the workbook directly from the email.

\[optional\] Select the Run queries as recipient checkbox to run workbook queries as the recipient of the email. If deselected (default), queries run as the user who performs the action. When Run queries as recipient is enabled, each query runs separately per recipient. Larger list of recipients result in more queries and longer processing times. Each recipient must be a Sigma user, and the user who performs the action must have an account type with the Run exports as recipient permission enabled.

\[optional\] Select the Send as .zip file checkbox to send attachments as a compressed zip file.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Export to Slack  
Create an action that exports an entire workbook, a specific page, or an individual element to Slack.

To create a Slack export action, the Slack integration must be enabled for your organization. If you want to send notifications to a private channel, you must also add Sigma to the private channel. See Adding Sigma to a private Slack channel.

📘  
This action can only be configured and triggered by users assigned an account type with the Export to Slack permission enabled.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Notify and export.  
Destination Select Slack.  
To For Specific users / teams, enter a comma-separated list of Slack \#channel-names, channel-ids, or member-ids.

For Dynamic recipients, provide a list of channel names, channel ids, or member ids based on dynamic information from a control or formula. If your action is configured on a table, pivot table, or input table, you can also provide a column that contains a list of channel names, channel ids, or member ids.  
Message \[optional\] Enter a message to include in the Slack notification. For dynamic text, press \= on your keyboard to open the formula bar and configure dynamic text . Sigma includes basic information about the sender and workbook in the message body by default. For more information on formatting a message, such as tagging users, see Format a slack message.  
Attachment Confirm that the Attachment toggle is turned on. Select the workbook content to export, then choose a file type.  
More options \[optional\] Select the Include link to workbook checkbox to allow Slack channel members to open the workbook directly from the Slack message.  
💡  
When sending to Slack channels, Sigma recommends using channel ids rather than channel names. For more information, see Format a slack message.

If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Export to Microsoft Teams (Beta)  
Create an action that exports an entire workbook, a specific page, or an individual element to Microsoft Teams.

To create a Teams export action, the Microsoft integration must be enabled for your organization. To send notifications to a channel, you must also add Sigma to the channel. See Add the Sigma Notifications app to Teams.

📘  
This action can only be configured and triggered by users assigned an account type with the Export to Microsoft Teams and SharePoint permission enabled.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Notify and export.  
Destination Select Microsoft Teams.  
Channel URL Enter the URL for the Microsoft Teams channel. For example:

[https://teams.microsoft.com/l/channel/\>](https://teams.microsoft.com/l/channel/%3E)\<channel-ID-and-name\>?groupId=\<group-ID\>\&tenantId=\<tenant-ID\>  
Message \[optional\] Enter a message to include in the notification. Sigma includes basic information about the sender and workbook in the message body by default. For more information on formatting a Teams message, such as supported markdown syntax, see Format a Microsoft Teams message.  
Attachment Select the workbook content to export, then choose a file type and layout.  
More options \[Optional\] Select the Include link to workbook checkbox to allow Teams channel members to open the workbook directly from the Teams message.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Export to SharePoint (Beta)  
Create an action that exports an entire workbook, a specific page, or an individual element to Microsoft SharePoint.

To create a SharePoint export action, the Microsoft integration must be enabled for your organization.

📘  
This action can only be configured and triggered by users assigned an account type with the Export to Microsoft Teams and SharePoint permission enabled.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Notify and export.  
Destination Select SharePoint.  
Folder URL Enter the URL for the SharePoint folder. For example:

https://\<organization\>.sharepoint.com/:f:/s/\<site-name\>/\<folder-id\>  
Attachment Select the workbook content to export, then choose a file type and layout.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Export to a webhook  
Create an action that exports an individual element’s data to another application with a webhook.

📘  
This action can only be configured and triggered by users assigned an account type with the Export to webhook permission enabled.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Notify and export.  
Destination Select Webhook.  
Endpoint Enter the receiving application’s endpoint.  
Attachment Select an element to export, then choose a data format.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Export to cloud storage  
Create an action that exports an individual element’s data to cloud storage.

📘  
This action can only be configured and triggered by users assigned an account type with the Export to cloud permission enabled.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Notify and export.  
Destination Select Cloud Storage.  
Storage integration Enter an integration name.  
Cloud Storage URI Enter a file path for the export destination.  
Element Select an element to export, then choose a file format.  
More options \[optional\] Select the Prefix file name with current date and time checkbox to include the export date and time (in ISO format) in the file name.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
Example: Slack notification workflow for new project tasks  
You can configure workbook actions that send notifications to users about changes to a workbook, such as new data entry or changes to existing data.

In this example, imagine you're interacting with a project tracker data app. Users can add new projects, tasks, and statuses.

A gif shows a user demonstrating a project tracker application, adding a task to a project.

You decide to configure a workbook action to send a notification whenever a user assigns a new task. Currently, users add tasks by selecting Add Task, entering information into the provided modal, and clicking the Create Task button to add the task to an input table.

Using the Notify and export action, you can send a notification by Slack whenever someone clicks the Create Task button, so that users are always up to date when a task is assigned to them.

Navigate to the Create Task modal, and open the Actions panel.  
Add an action to the On click \- primary action sequence.  
In the Action modal, configure the action:  
Action Select Notify and export.  
Destination Select Slack.  
To Select Dynamic recipients and Formula

In the formula bar, enter the following formula:  
Lookup(\[Employees/Slack ID\], \[ct-Task-Owner\], \[Employees/Name\])

In the context of this workbook, this formula uses a Lookup to return a Slack ID based on the name of the user currently selected in the Task Owner control.  
Message Enter a message to be sent to the user with the assigned task.

To tag them, press \= on your keyboard to open the formula bar. In the formula bar, enter the following formula:  
"\<@" & Lookup(\[Employees/Slack ID\], \[ct-Task-Owner\], \[Employees/Name\]) & "\>"

In the context of this workbook, this concatenates the user's Slack ID with the characters required to tag them in Slack. For more information on this, see Format a slack message.  
Attachment Turn the Attachment toggle off.  
More options Select the Include link to workbook checkbox.  
\[optional\] Click More to add a condition to the Action sequence. In the example below, the condition IsNotNull(\[ct-Task-Name\]) prevents tasks from being published with a blank name.

Create actions that generate embed iframe events  
Suggest Edits  
Workbook actions configured in an embedded workbook support interaction with host applications. You can configure an action to send an iframe event from your embedded content to your host application, which can then react to this event with some outcome. For example, you can use these events to add custom tracking, change the UI of your application, or trigger your own application APIs.

This document explains how to configure the Generate iframe event action in an embedded workbook. For more information about actions in Sigma, see Intro to actions. For more information about embedding, see Intro to embedded analytics.

System and user requirements  
📘  
The following requirements apply to users who configure actions. Users who access and interact with a workbook can typically trigger all existing actions within it. Any restrictions are noted in this document.

The ability to configure actions requires the following:

You must be assigned an account type with the Full explore or Create, edit, and publish workbooks permission enabled.

You must be the workbook owner or be granted Can explore1 or Can edit workbook permission.

1  
If you’re granted Can explore workbook permission, you can configure actions in custom, saved, and shared views. Actions saved to views do not apply to the workbook’s published version.

This workbook action is only relevant for embedded workbooks. See Intro to embedded analytics for specific requirements for public and secure embedding.

Prerequisites  
Configure an event listener and an action:outbound event in your application to receive messages about the user interactions in the embedded workbook. You can then develop custom logic in your host application to respond to these events.

See Implement inbound and outbound events in embeds for information about about how to send and receive events between a parent application and Sigma.  
See the configuration instructions for the action:outbound event to configure the outbound event required for this workbook action to take effect.  
Generate an outbound iframe event  
Create an action that generates an outbound iframe event.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
Action Select Generate iframe event.  
Event name Enter the name of the event configured in the name property in the action:outbound event in your host application.  
Event key and Key value Enter the key names and values configured in the values property in the action:outbound event in your host application.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.

Create actions that modify plugins  
Suggest Edits  
You can create actions that enable workbook elements to trigger effects within a plugin. For example, an action like selecting a table cell can trigger a specific plugin effect. This document explains how to create actions that trigger plugin effects.

To configure your plugin code to support actions, see Configure plugins to work with actions. For more information about actions in Sigma, see Intro to actions.

User requirements  
📘  
The following requirements apply to users who configure actions. Users who access and interact with a workbook can typically trigger all existing actions within it. Any restrictions are noted in this document.

The ability to configure actions requires the following:

You must be assigned an account type with the Full explore or Create, edit, and publish workbooks permission enabled.

You must be the workbook owner or be granted Can explore1 or Can edit workbook permission.

1  
If you’re granted Can explore workbook permission, you can configure actions in custom, saved, and shared views. Actions saved to views do not apply to the workbook’s published version.

Prerequisites  
You must configure your plugin to be compatible with actions. See Configure plugins to use as target elements.  
Modify a plugin  
Create an action that modifies a plugin.

Open the draft, custom view, or saved view of a workbook.

Select the trigger element (the element users must interact with to initiate the action).

🚧  
To avoid causing an infinite loop, do not configure an action sequence containing the same plugin as both the trigger and target element.

In the editor panel, open the Actions tab.

Create a new sequence, or locate an existing sequence that you want to modify.

Select the default action (if creating a new sequence), or click Add action to add a new action to the sequence.

In the modal, configure the required fields to define the response:

Action Select Trigger plugin.  
Target plugin Select the name of the plugin element you want to modify.  
Select effect Select the name of the configuration object that was created from the steps in Configure plugins to use as target elements.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:

To trigger the action sequence only when a user selects a cell in a specific column, click the When selecting cells in column field and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.

\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.

💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

\[optional\] To execute the action sequence only when a specific condition met, click More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.

Create actions that call stored procedures  
Suggest Edits  
Workbooks support actions that can call a stored procedure and allow you to use the output of the stored procedure as a variable.

For example, if you have an existing stored procedure in your data platform that you use to perform a complex calculation, rather than recreating the logic in a Sigma custom function or formula, you can call the stored procedure and use the output in Sigma.

This document explains how to create actions to call a stored procedure. For more information about actions in Sigma, see Intro to actions.

For specific end-to-end examples, see:

Example: Run a stored procedure with column data.  
Example: Run a stored procedure based on user input.  
Limitations  
Only BigQuery, PostgreSQL, Redshift, and Snowflake are supported.

The stored procedure must be contained in a schema that is indexed by Sigma (available through the connection in the data catalog). Do not place any stored procedures in the same schema used for write back.

Variant argument types are not supported.

Arguments with default values are not supported.

To work with the return value or output of a stored procedure, the stored procedure must return a scalar value.

If a stored procedure returns tabular data, you cannot work with the output as a variable and instead must locate the created table in the data catalog for the connection to work with it in Sigma.  
If the stored procedure returns an array, modify the stored procedure to convert the array to text (serialize) and then deserialize the data in the stored procedure.  
User and system requirements  
The ability to configure stored procedure actions requires the following:

You must be assigned an account type with the Full explore or Create, edit, and publish workbooks permission enabled, and the Create stored procedure actions permission enabled.

You must be the workbook owner or be granted Can explore1 or Can edit workbook access.

1  
If you’re granted Can explore workbook access, you can configure actions in custom, saved, and shared views. Actions saved to views do not apply to the workbook’s published version.

You cannot define stored procedures in Sigma. Before you can create an action to call a stored procedure in Sigma, you must create the stored procedure in your data warehouse or data platform.

Requirements to call a stored procedure from an action  
To call a stored procedure from an action, the following applies:

You must be assigned an account type with the Call stored procedure action permission enabled.

You must have Can use access or greater granted on the connection, or Can use access granted on the stored procedure in Sigma. See Manage access to data and connections.

The user and role associated with the connected data platform must have permission to use and run the stored procedure in the data platform.

For a BigQuery connection, if the service account is granted the BigQuery Data Viewer role, no additional permissions are required. See Connect to BigQuery.

For a PostgreSQL connection, the service account must be granted EXECUTE privileges on the stored procedure.

For a Redshift connection, the service account must be granted USAGE on the schema that contains the stored procedure and EXECUTE on the stored procedure. See Connect to Redshift.

For a Snowflake connection, the user's default role or the service account role must be granted the following privileges:

USAGE on the schema that contains the stored procedure.  
USAGE or OWNERSHIP on the stored procedure.  
See Connect to Snowflake.

📘  
If a user with Can Explore or Can Edit access to the workbook does not have Can use access granted on the stored procedure or relevant connection and also does not have access to run stored procedures in the data platform, they cannot see or modify the stored procedure. The stored procedure does not appear when browsing available connections in the data catalog, and an already configured action appears blank.

Users with Can use access to the stored procedure granted in Sigma, but without permissions to run the stored procedure in the data platform, can see the stored procedure, but attempts to call the stored procedure with the action fail.

Call a stored procedure from an action  
Create an action that calls a stored procedure in your data platform.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Create a new sequence, or locate an existing sequence that you want to modify.  
Select the default action (if creating a new sequence), or click  Add action to add a new action to the sequence.  
In the modal, configure the required fields to define the response:  
When selecting cells in	Select a column from the trigger element to initiate the action when clicked. This field only applies when the trigger element is a table, pivot table, or input table.  
Condition	\[optional\] Turn on the switch to configure a condition that should be met for the action to take effect.  
Action	In Advanced, select Call stored procedure.  
Select a stored procedure	Search or browse to the stored procedure that you want to call, then select the stored procedure.  
Configure the stored procedure setup. These steps might be different depending on the arguments and signatures expected by the stored procedure:

Select signature	If the stored procedure has multiple signatures, in the list of signatures, select the desired signature for the stored procedure.  
Set value for: \<argument\>	Assign values to the stored procedure argument using one of the following options:

\- Static values: Enter a value for the argument.  
\- Column: If the action is triggered from a data element, choose a column in the data element to which the action applies to provide the argument value.  
\- Control: Choose a control element in the workbook to provide the argument value.  
\- Formula: Enter a formula to use to provide the argument value. The provided argument value must match the data type expected by the stored procedure.  
Outputs	If the stored procedure provides an output, review the variable name and data type with which the output is available. For example, for a stored procedure named "echo\_args", the action variable is echo\_args.  
If the trigger element is a table, pivot table, or input table, configure additional settings that determine when and how user interaction triggers the action sequence:  
To trigger the action sequence only when a user selects a cell in a specific column, click the dropdown following the On select heading and select the column. To trigger the action sequence when a user selects a cell in any column, select Any column.  
\[optional\] To control whether keyboard navigation within the element can trigger action sequences on the element, click  More in the Actions panel, then select Allow keyboard to trigger actions. When the option displays a checkmark, keyboard navigation and pointer events (e.g., mouse clicks) can trigger the action sequences. When the option doesn't display a checkmark (default), only pointer events can trigger them.💡  
Keyboard navigation as a trigger interaction can disrupt the user experience. For example, if the element's action sequences include actions that open links or other workbooks, a user can be unintentionally navigated away from their current task. This can be particularly disruptive if the action sequence can be triggered by selecting a cell in any column.

Consider allowing keyboard navigation to trigger actions only when it facilitates the configured action sequences and is unlikely to interfere with usability.

If the trigger element is a plugin, select the name of the plugin configuration object under Custom plugin. In your code editor, refresh your plugin, then test the action in the workbook. For more information, see Configure plugins to use as trigger elements.  
\[optional\] To execute the action sequence only when a specific condition is met, click  More in the action sequence, then select Add condition and configure the criteria. For more information about conditions, see Define an action condition.  
📘  
When using a stored procedure action in an action sequence, Sigma waits for the stored procedure to finish running before triggering the next action in the sequence. If the stored procedure fails with an error, the action sequence stops running and any following actions in the sequence do not run.

For more details about calling a stored procedure with an action, see the following examples.

Who the stored procedure runs as  
When a stored procedure is run from Sigma as an action, the user that the stored procedure runs as depends on your connection settings and the configuration of your stored procedure. In some data platforms, you can configure the stored procedure to run either as the caller or as the owner.

If your stored procedure is set up to run as the caller:

For an OAuth connection, the stored procedure runs in your data platform as the user who triggered the action.  
For a non-OAuth connection, the stored procedure runs in your data platform as the user and using the role specified in the connection, sometimes referred to as the service account.  
Example: Run a stored procedure with column data  
As an end-to-end example, run a stored procedure based on user selection in a data element.

For example, if you have a stored procedure in BigQuery called GET\_CAMPAIGN\_STATUS that compiles and calculates the latest clickthrough data for an email campaign performed in a third-party tool. The stored procedure takes one argument, the name of the email campaign, and outputs text with the plain text body of the email.

Open your workbook for editing.

Add relevant workbook elements:

Add a data element, for example a table with a row for each email campaign sent by your marketing department, with columns like Campaign Name and Date Sent.  
Add a text area control next to the data element and rename the control Campaign details.  
On the data element, define an action sequence that runs On select from the Campaign Name column:

Add the Call stored procedure action and configure it:  
Navigate to the BigQuery connection and search for the GET\_CAMPAIGN\_STATUS stored procedure.  
For Set value for arg1: name, choose Column, then choose the Campaign Name column in the data element that contains the name of the email campaign.  
Note the action variable used for the response, get\_campaign\_status.  
Add the Set control value action and set the value to the Action variable: get\_campaign\_status.  
Input table with an action sequence configured On select of the Campaign Name column to open a modal, call a stored procedure, and set the Campaign Details control element.  
Test the workflow. In this example, a modal appears with the text of the email campaign:

A modal titled Campaign Details with details about the eggscuse me email campaign, promising hats and books with eggtastic info.  
Publish your workbook.

💡  
Add the output control to a modal to add interactivity and reduce visual clutter. Set the action sequence for the primary button for the modal to clear the control and close the modal.

Example: Run a stored procedure based on user input  
As another end-to-end example, run a stored procedure based on user input.

For example, recalculate the project budget requirements based on several inputted values. In this example, assume that you have access to a stored procedure in Redshift called ESTIMATE\_BUDGET that calculates the estimated budget for a project. The stored procedure takes 3 number arguments, one for estimated materials cost, one for estimated number of employees, and one for number of weeks, and outputs a string with a budget estimate.

Open your workbook for editing.

Add relevant workbook elements:

Add three number input control elements to use as the input for the calculation, named:

Materials cost  
Headcount  
Weeks  
💡  
Use a slider control instead of a static value to set a number, which allows you to constrain the input values.

Add a text input control element to display the output of the stored procedure, named Estimated budget.

Add a button element. Update the button title to Estimate the budget\!.

Three number input controls labeled as documented, with a pink button labeled Estimate the budget\! followed by a text input to store the budget estimate.  
On the button element, define an action sequence with the following actions:

Add the Set control value action and target the Estimated budget control element. Set the value to "Calculating…"  
Add the Call stored procedure action.  
Navigate to the Redshift connection and search for the ESTIMATE\_BUDGET stored procedure.  
For Set value for arg1: cost, choose Control, then choose the Materials cost control.  
For Set value for arg2: headcount, choose Control, then choose the Headcount control.  
For Set value for arg3: weeks, choose Control, then choose the Weeks control.  
Note the action variable used for the response, estimate\_budget.  
Add the Set control value action and target the Estimated budget control. Set the value to an Action variable, then choose the estimate\_budget variable to display the output of the stored procedure.  
TODO:  
Test the workflow:

Add numbers to each input control, then click the button.  
Review the output control, Estimated budget.  
Gif entering number values into the three inputs, clicking estimate the budget, then waiting for a budget estimate to appear.  
Publish the workbook.

💡  
Add another button with an action sequence that inserts a row to an input table with the values of all 4 control elements to keep a historic record of the various budget estimates, then clears all the controls on the page to reset the configuration.

Configure an action sequence  
Suggest Edits  
Configure an action sequence to run a set of workbook actions in a specific order.

Action sequences ensure user interactions trigger multiple actions in the order necessary to achieve a particular workbook response. Sigma allows you to add and reorder actions within a sequence, move actions between different sequences, and duplicate an existing sequence. You can also configure a condition that determines whether or not a sequence executes.

This document explains how to create and manage an action sequence. For more information about available workbook actions, see Intro to actions.

📘  
An action sequence only defines the order in which actions are executed within that sequence. Actions in different sequences run concurrently and may not finish in the order the sequences are configured and displayed in the action panel.

User requirements  
📘  
The following requirements apply to users who configure actions. Users who access and interact with a workbook can typically trigger all existing actions within it. Any restrictions are noted in this document.

The ability to configure actions requires the following:

You must be assigned an account type with the Full explore or Create, edit, and publish workbooks permission enabled.

You must be the workbook owner or be granted Can explore1 or Can edit workbook permission.

1  
If you’re granted Can explore workbook permission, you can configure actions in custom, saved, and shared views. Actions saved to views do not apply to the workbook’s published version.

Limitations  
The Trigger plugin action is not guaranteed to execute in sequence. In cases where you use an action to set or clear a control and expect your plugin to read the updated value, the plugin may read the original value instead.  
Create an action sequence  
To create a new action sequence, follow these steps:

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Add an action using one of these methods:  
Click  Add action within an existing sequence. If there were no previously configured actions on this element, add the action inside the empty sequence group.  
Click  Add action sequence at the top of the actions panel to add the action outside of an existing sequence. Choosing this option creates a new action sequence group positioned below any previously existing ones.  
Configure your action.  
Click  Add action to add another action to your sequence. Sigma duplicates the immediately previous action in the sequence, which you can then modify.  
Continue adding and configuring actions in your sequence until you achieve the behavior you wanted for that element. You can drag and drop the actions within the sequence to change their order.  
\[optional\] If you want the sequence to execute only in certain circumstances, click  More, then click Add condition. See Make an action conditional for more information about action conditions.  
\[optional\] Rename the sequence and individual actions within the sequence by double-clicking on the sequence or action names. Giving your actions and the sequences more meaningful names can help you quickly differentiate them when you have a large number of actions triggering from a single element.  
Organize multiple actions into a sequence  
If an element has multiple actions configured, each action runs in parallel by default. If you want to control the order in which multiple actions on an element execute, move them into the same sequence and arrange them in the order that you want.

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
Review the actions that you have and decide which ones to organize in a sequence.  
If the actions have different conditions that determine whether or not they run, place them in different sequences. Each sequence can only have a single condition. See Make an action conditional for more information about action conditions.  
If the order of execution matters for the actions, place them in the same sequence.  
Drag and drop your actions to move them between sequences and to change the order within sequences.  
Save the workbook, then test your action in the workbook to ensure the execution logic matches your intentions.  
Pause or resume sequences  
Pause or resume action sequences to debug and test actions. You can control the pause/resume state of individual sequences or globally change the state of all sequences in the workbook. To prevent stale paused states and avoid workflow disruptions, paused sequences automatically resume when the workbook is refreshed.

To pause or resume an individual sequence, click  More next to the sequence name and select Pause sequence or Resume sequence.

To pause or resume all sequences in the workbook, click  More options in the document header, then select Pause all action sequences.

When a sequence is paused, Sigma displays the Action sequence paused icon () next to the sequence name.

📘  
All newly added sequences inherit the workbook-level pause/resume setting.  
When you pause or resume an individual sequence, the change overrides the workbook-level setting.  
Subsequent changes to the workbook-level pause/resume setting apply to all sequences, regardless of their individual sequence-level setting.\_

Define an action condition  
Suggest Edits  
You can define an optional condition for any action sequence to control the circumstances in which the actions in that sequence should take effect. The condition can be a custom formula or, if you are configuring an action sequence for selected controls, the condition can be the value of the control. Conditions based on custom formulas can reference action variables to reference the values the user selected in a table or visualization. For more information about actions in Sigma, see Intro to actions.

To make an action sequence conditional, click  More, then click Add condition when creating or editing the action.

You can configure multiple action sequences, each with an optional condition. If a user interacts with an element that has multiple action sequences configured, each action sequence triggers if its condition, if there is one, evaluates to true.

Example: Modify a chart display based on a segmented control  
You can configure an action on a segmented control that modifies the display of a visualization based on the value the user selects in the control. For more about using segmented controls, see Create and configure a segmented control.

For example, if you have a chart showing the total sales, broken down by region, you can add a segmented control to allow users to change the display of the chart to their preferred view.

To achieve this, follow these steps:

Add a segmented control targeting your visualization, giving it two values: Individual trend and Comparison.

Add an action sequence on the control with the following configuration:

Condition	Set to Control value is equal to. For this example, select Individual trend.  
Action	Select Modify element.  
Target element	Select the visualization targeted by the control. In this example, the visualization is Total sales by country over time.  
What to modify	Select a modification to display the chart in a way that matches the user selection in the control. In this example, the modification is Move columns and to trellis column.  
Column to move	In this example, the column is Country.  
Add a second action sequence on the control with the following configuration:

Condition	Set to Control value is equal to. For this example, select Comparison.  
Action	Select Modify element.  
Target element	Select the visualization targeted by the control. In this example, the visualization is Total sales by country over time.  
What to modify	Select a modification to display the chart in a way that matches the user selection in the control. In this example, the modification is Move columns and to color \- category.  
Column to move	In this example, the column is Country.  
You now have two action sequences configured on your segmented control, each one modifying your visualization element based on the value of the segmented control.

Publish your changes to the workbook.

When viewers interact with the control, they can now swap back and forth between the individual trend and comparison view of the data in your visualization.

GIF showing a visualization of Total sales by country over time and a control with two values, Individual trend and Comparison. In the animation, a user clicks each of the two values, demonstrating that the chart visualization switches between a trellis view of each country and a combined view in a stacked bar chart.

Example: Limit form submissions with a deadline  
You can configure a condition on an action sequence to prevent it from occurring if a deadline has passed.

For example, if you are creating a form, you can configure the action on the submission button to insert a row in an input table only if the deadline has not yet passed. For more information about actions that insert rows in input tables, see Create actions that modify input table data.

To achieve this, follow these steps:

Create a workbook with an empty input table, one or more text controls, and a button element.

Configure the input table data entry permissions to allow edits in the published version. See Configure data governance options in input tables for details on how to modify data entry permissions.

Add another control of any type to the workbook, then open the editor panel and set the Control type to Date. In this example, the date control has a control ID of Deadline-Control.

Set a date in your date control to a future date. This date is used as the deadline when you set the condition.

Select the button element.

In the editor panel, open the Actions tab.

Add an action sequence with the following configuration:

Condition	Set to Custom formula. For this example, enter DateDiff("day", Today(), \[Deadline-Control\]) \> 0 . This formula evaluates to True if the number of days between the current date and the date set in the date control with the ID "Deadline-Control" is greater than zero.  
Action	Select Insert row.  
Into	Select the name of your input table. In this example, the name is Form Submissions.  
With values	Select the control elements that make up your form.  
Publish your workbook, then view the published version.

Test your action by entering text in the text controls, then clicking the button.

If the date in your date control is set to a date later than today's date, the values of your text controls should appear as new rows in your input table.  
If you update the date in your date control to today's date or any past date, clicking the button does not insert a row, because the deadline has passed.

Use variables in actions  
Suggest Edits  
Action variables allow formulas written within an action to reference values the user selected within a table or visualization, or the results from a previously run action like a stored procedure action. You can use action variables in any custom formula for an action, including conditions.

When actions are triggered from a table or visualization, Sigma generates a piece of data called Selection which represents the values of the rows that the user selected in a table or the data points the user selected in a visualization.

Reference the Selection variable to work with the selected data point, such as to run an action condition on a specific row selected by a user, display the specific value selected by a user in a dynamic text formula, or pass a selected value to another formula. When referencing the Selection action variables, you can perform all of the usual functions that tables support, such as aggregations, conditions, and lookups.

📘  
Action variables persist only during the execution of the action sequence and can only be referenced inside formulas for actions or conditions for action sequences. If you want to reference a user-selected value or stored procedure result outside of an action sequence, set a control to the action variable, then reference the value of that control instead.

User requirements  
📘  
The following requirements apply to users who configure actions. Users who access and interact with a workbook can typically trigger all existing actions within it. Any restrictions are noted in this document.

The ability to configure actions requires the following:

You must be assigned an account type with the Full explore or Create, edit, and publish workbooks permission enabled.

You must be the workbook owner or be granted Can explore1 or Can edit workbook permission.

1  
If you’re granted Can explore workbook permission, you can configure actions in custom, saved, and shared views. Actions saved to views do not apply to the workbook’s published version.

Reference a variable in a custom formula for an action  
To reference a variable in an action, do the following:

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
In the panel, add an action or edit an existing one using one of these methods:  
Click  Add action within a sequence group to add an action within an existing sequence. If there were no previously configured actions on this element, add the action inside the empty sequence.  
Click  Add action sequence at the top of the actions panel to add the action outside of an existing sequence.  
Hover over the name of an existing action, then click Edit  to open the Action modal.  
In the Action modal, choose an action type that supports using custom formulas to set a value, such as Insert row or Set control value.  
In the Set value as or With values field, select Formula.  
In the formula bar, use the syntax \[Selection/\<Column Name\>\] to reference the the values the user selected in the element. Depending on the element type, the user may be selecting values in table cells or data points in a chart.  
\[optional\] If the element is a table, set the When selecting cells in field for the sequence to a specific column in the table. Setting this value restricts the actions you configure in the sequence to trigger only when the user clicks on that column.  
Reference a variable in a condition for an action  
Action variables also work in conditions. For more about configuring conditions for actions, see Make an action conditional.

To reference a variable in an action condition, do the following:

Open the draft, custom view, or saved view of a workbook.  
Select the trigger element (the element users must interact with to initiate the action).  
In the editor panel, open the Actions tab.  
If there is not already a condition defined in the sequence, click  More, then click Add condition.  
Click on the gray condition bar to open the Condition modal.  
Choose Custom formula.  
In the formula bar, use the syntax \[Selection/\<Column Name\>\] to reference the values the user selected in the element. Depending on the element type, the user may be selecting values in table cells or data points in a chart.  
Examples  
Formula with action variables	Usage  
\[Selection/Region\] \= "South" or \[Selection/Region\] \= "East"	  
This formula identifies a user's selection of a table cell or corresponding data point in a visualization that corresponds to either the value "North" or the value "East" in the Region column.

Use this formula in a condition to limit the action execution depending on the user's selection in the data. To configure unique actions depending on the values the user selects, configure multiple action sequences, each with a condition based on an action variable.

Lookup(\[Selection/Company Name\], Max(\[Selection/Revenue\]), \[Selection/Revenue\])	  
This formula returns the value of the Company Name column that has the largest value in the Revenue column.

Use this formula to set a control value when the user clicks in a grouped column to single out a particular value from within the grouping.

For examples using a stored procedure result as an action variable, see the examples in Create actions that call stored procedures.

Create cross-element filters  
Suggest Edits  
Actions support dynamic cross-element filtering, which enables user interactions with one element to filter the data of other elements in the same workbook. For example, when a user clicks a data point in one chart (the trigger element), Sigma automatically applies a filter to another chart (the target element) using the dimension value of the clicked data point.

This document explains how to configure cross-element filtering using control elements and actions. For more information about actions, see Intro to actions.

User requirements  
The ability to configure cross-element filtering for workbook elements requires the following:

You must be assigned an account type with the Explore workbooks or Create, edit, and publish workbooks permission enabled.  
You must be the workbook owner or be granted Can explore or Can edit workbook permission.  
📘  
These requirements only apply to users who configure cross-element filters. Configured cross-element filters are applied to the interactions of any user who can view the workbook.

Configure a cross-element filter  
In Sigma, a cross-element filter consists of at least three workbook elements: a trigger element, a control element, and a target element.

The trigger element in a cross-element filter is typically a table, pivot table, input table, or visualization. When a user interacts with the trigger element by clicking a table cell in a specific column or any data point on the chart, a workbook action (configured on the trigger element) updates the value of the control element, which subsequently filters the target element.

To configure this cross-element interactivity, you must complete the following:

Create a control that filters the target element  
Create a workbook action to set the control value  
💡  
The workflows demonstrated in this document are used to configure a cross-element filter for a single dimension on one target element.

To filter multiple dimensions on the same target element, create a separate control and action for each dimension.  
To filter a single dimension on multiple target elements, create one control, then add all target elements as filter targets in the control element properties.  
To filter multiple dimensions on multiple target elements, create a separate control and action for each dimension, then add all target elements as filter targets in each control element’s properties.  
Create a control that filters the target element  
The following steps explain how to create an element filter and quickly convert it to a preconfigured list or date control element. If you want to filter the target element using a different control type, see Intro to control elements for information about creating a new control from the ground up.

Open the draft, custom view, or saved view of a workbook and add at least one trigger element and one target element.

Hover over or select the target element and click  Filters in the element menu.

In the Filters & controls modal, create a filter and convert it to a control element:

Click  Add filter, then select the underlying data column you want to filter. You don’t need to choose filter values at this time.

Click  More to open the filter menu, then select Convert to page control.

Sigma adds a preconfigured control element that aligns with the filter you converted. The control’s value source, source column, and filter target are automatically set to filter the target element.

Create a workbook action to set the control value  
The following steps explain how to configure a workbook action on the trigger element to set the value of the control element created in the previous section.

Open the draft, custom view, or saved view of a workbook.

Select the trigger element (the element users must interact with to initiate the action).

In the editor panel, open the Actions tab.

Create a new sequence, or locate an existing sequence that you want to modify.

Select the default action (if creating a new sequence), or click  Add action to add a new action to the sequence.

In the modal, configure the required fields to define the response:

If the trigger element is a table, pivot table, or input table, select a column in the When clicking cells in field. Sigma only initiates the cross-element filter when a user clicks a cell in this column.  
If the trigger element is a visualization, button, image, or control, skip this step and proceed to step 3b.

\[optional\] Configure a condition that should be met for the action sequence to take effect. To add a condition, click  More, then click Add condition.

Configure the remaining fields based on the type of response you want to initiate:

Action	  
Select Set control value.

This particular action type enables the cross-element filter.

Update control value	  
Select the control element created in the previous section, Create a control that filters the target element.

Sigma sets the value of this specific control, which is preconfigured to filter the target element.

Set value as	  
Option 1: Select Specific values to always set the control to one or more fixed values, then choose the values.

Option 2: Select Values from a specific column to set the control to a value from a particular column, then choose the column. The control is dynamically set based on the column value from the same row as the clicked cell or data point.

For the cross-element filter to function correctly, the selected values or column must align with the values in the control element’s filter target. The filter target is configured in the control’s Element properties \> Targets tab and is the column selected in step 3a of the previous section, Create a control that filters the target element.

With the workbook action configured, user interaction with the trigger element initiates a workflow that immediately updates the control value and filters the target element. For a real-time demonstration of this cross-element filter, see the interactive demo.

Interactive demo  
In the following embedded example, click any slice in the pie chart to set the State control value and filter the map by state. You can then drill into the population data by state county.

💡  
When the trigger element is a visualization, the cross-element filter also supports the following interactions:

To set multiple control values, hold ⌘ Command (Mac OS) or Ctrl (Windows) while clicking data points (for example, pie slices) in the chart.

To clear the selection in the trigger element and reset the control value and filter, click any blank space in the trigger element. Note that this click-to-clear functionality only works for visualizations like those in this demo and not for tables or pivot tables.

When the trigger element is a table, pivot table, or input table, you cannot set multiple control values. If you select multiple cells, the last cell you click determines the control value.

Perform AI queries  
Suggest Edits  
If your data warehouse includes one or more SQL functions that you can use to work with generative AI models, you can run those SQL functions from Sigma and perform an AI query.

When you run an AI query, you can call an AI model from your cloud data warehouse and run it on columns in your data, returning the output to Sigma.

Requirements  
You must have a connection set up to a cloud data warehouse that supports AI functions:  
Snowflake  
Databricks  
Google BigQuery\*  
Amazon Redshift\*  
The account used to authenticate to the data warehouse must have permission to use the AI functions that you want to use.  
The Sigma user must have at least Can use access to the connection.  
\*  
Might require additional model configuration steps. Refer to the documentation for your data warehouse.

Run an AI query  
You can run an AI query in one of two ways:

Use the CallVariant function in a calculated column to query the cloud data warehouse, then work with the output in a table column.  
Use a custom SQL element to directly query the cloud data warehouse using an AI query, then work with the output in a table.  
If you want to streamline AI queries for users in your Sigma organization, consider creating a custom function with the syntax for a specific AI query. For more details, see Boosting Productivity: Leveraging Cloud Data Warehouse AI Functions in Sigma for Enhanced Insights on the Sigma Blog.

Follow the steps for your cloud data warehouse:

Run an AI query in Snowflake  
Run an AI query in Databricks  
Run an AI query in BigQuery  
Run an AI query in Amazon Redshift  
For examples of using AI queries as part of a larger workflow, see the YouTube playlist Build with AI on the Sigma YouTube channel.

Run an AI query in Snowflake  
Snowflake supports several Large Language Model (LLM) functions that you can use to perform an AI query from Sigma.

For example, if you have a table with call transcripts in a column Call Transcript and you want to evaluate the sentiment of the call, you can add a column to your table with the following formula:

CallNumber("SNOWFLAKE.CORTEX.SENTIMENT", \[CALL\_TRANSCRIPT\])  
The Snowflake Cortex function returns \-1, 0, or 1 depending on the sentiment of the transcript.

As another example, using the same table with call transcripts in a column Call Transcript, you can add a column to your table with the following formula, which prompts the AI model to return the top three topics discussed:

CallVariant("SNOWFLAKE.CORTEX.COMPLETE", "llama2-70b-chat", "return a short, comma-separated list of the top three topics discussed in the call, ignoring any small talk" & \[CALL TRANSCRIPT\])  
For more details about the available LLM functions, see Large Language Model (LLM) Functions (Snowflake Cortex) in the Snowflake documentation.

Run an AI query in Databricks  
Databricks supports several LLM functions that you can use to perform an AI query from Sigma, such as to classify data.

For example, if you have a table with website analytics data and want to classify the type of content based on the page title column Page Title, you can add a column to your table with the following formula, supplying the possible content types in the ARRAY section:

CallVariant("ai\_classify", (\[Page Title\], CallVariant("ARRAY", ("marketing", "documentation", "API reference")))  
Alternatively, you can provide the labels in another table column Content Types:

CallVariant("ai\_classify(\[Page Title\], ARRAY(\[Content Types\])))  
See AI Functions on Databricks in the Databricks documentation.

Run an AI query in BigQuery  
BigQuery provides generative AI functions such as ML.GENERATE\_TEXT.

Using AI functions in BigQuery requires you to configure a remote model. See The CREATE MODEL statement for remote models over LLMs in the Google Cloud BigQuery documentation. To make the functions available in Sigma, create a user-defined function for each AI function that you want to use. See User-defined functions in the Google Cloud BigQuery documentation.

After setting up a model and a UDF, you can call that UDF in Sigma. For example, if you set up a UDF called my\_dataset.generate to generate text in response to a prompt using the ML.GENERATE\_TEXT function in BigQuery, and you have a table with a Call Organization column, you can prompt the model to generate text based on the transcript:

CallText("my\_dataset.generate", "Is this organization in the Fortune 500?", \[Call Organization\])  
As another example, if you have a UDF called my\_dataset.understand using the ML.UNDERSTAND\_TEXT function in BigQuery, and you have a table with a Call Transcript column, you can prompt an AI model to answer a question about the contents of the transcript:

CallVariant("my\_dataset.understand", "model\_name", "Does this transcript mention Sigma's writeback capabilities?" & \[CALL TRANSCRIPT\])  
For more details on the available generative AI functions, see The ML.GENERATE\_TEXT function.

Other AI functions are also available for processing data. See The ML.UNDERSTAND\_TEXT function in the Google Cloud BigQuery documentation.

Run an AI query in Amazon Redshift  
Using AI functions in Amazon Redshift requires you to create and configure a model and SQL endpoint using Amazon Sagemaker and Redshift user-defined functions (UDFs). See Use cases for the CREATE MODEL syntax in the Amazon Redshift documentation.

After setting up a model, you can call that model in Sigma. For example, if you set up a generative AI model called LLM\_extract to extract information from a provided text sample, and you have a table with a Call Transcript column, you can prompt the model to extract information from the column:

CallVariant("your\_redshift\_db.sagemaker.LLM\_extract", "extract logistical details related to in-person meetings" & \[Call Transcript\])

Snowflake Cortex AISQL (including LLM functions)  
Regional Availability

Available to accounts in select regions.

Individual functions in the Cortex AISQL suite are Preview Features. Check the status of each function on its SQL reference page before using it in production.

Functions not marked as preview features are generally available (GA) and can be used in production.

Use Cortex AISQL in Snowflake to run unstructured analytics on text and images with industry-leading LLMs from OpenAI, Anthropic, Meta, Mistral AI, and DeepSeek. Cortex AISQL supports use cases such as:

Extracting entities to enrich metadata and streamline validation

Aggregating insights across customer tickets

Filtering and classifying content by natural language

Sentiment and aspect-based analysis for service improvement

Translating and localizing multilingual content

Parsing documents for analytics and RAG pipelines

All models are fully hosted in Snowflake, ensuring performance, scalability, and governance while keeping your data secure and in place.

Available functions  
Snowflake Cortex features are provided as SQL functions and are also available in Python. Cortex AISQL functions can be grouped into the following categories:

AISQL functions

Helper functions

AISQL functions  
Task-specific functions are purpose-built and managed functions that automate routine tasks, like simple summaries and quick translations, that don’t require any customization.

AI\_COMPLETE: Generates a completion for a given text string or image using a selected LLM. Use this function for most generative AI tasks.

This is the updated version of COMPLETE (SNOWFLAKE.CORTEX).

AI\_CLASSIFY: Classifies text or images into user-defined categories.

This is the updated version of CLASSIFY\_TEXT (SNOWFLAKE.CORTEX) with support for multi-label and image classification.

AI\_FILTER: Returns True or False for a given text or image input, allowing you to filter results in SELECT, WHERE, or JOIN ... ON clauses.

AI\_AGG: Aggregates a text column and returns insights across multiple rows based on a user-defined prompt. This function isn’t subject to context window limitations.

AI\_EMBED: Generates an embedding vector for a text or image input, which can be used for similarity search, clustering, and classification tasks.

This is the updated version of EMBED\_TEXT\_1024 (SNOWFLAKE.CORTEX).

AI\_SUMMARIZE\_AGG: Aggregates a text column and returns a summary across multiple rows. This function isn’t subject to context window limitations.

AI\_SIMILARITY: Calculates the embedding similarity between two inputs.

AI\_TRANSCRIBE: Transcribes audio files stored in a stage, extracting text, timestamps, and speaker information.

PARSE\_DOCUMENT (SNOWFLAKE.CORTEX): Extracts text (using OCR mode) or text with layout information (using LAYOUT mode) from documents in an internal or external stage.

TRANSLATE (SNOWFLAKE.CORTEX): Translates text between supported languages.

AI\_SENTIMENT: Extracts sentiment scores from text.

EXTRACT\_ANSWER (SNOWFLAKE.CORTEX): Extracts the answer to a question from unstructured data, provided that the relevant data exists.

SUMMARIZE (SNOWFLAKE.CORTEX): Returns a summary of the text that you’ve specified.

Note

Functions that were formerly referred to as “LLM functions” are accessed in the “SNOWFLAKE.CORTEX” namespace

Helper functions  
Helper functions are purpose-built and managed functions that reduce cases of failures when running other AISQL functions, for example by getting the count of tokens in an input prompt to ensure the call doesn’t exceed a model limit.

COUNT\_TOKENS (SNOWFLAKE.CORTEX): Given an input text, returns the token count based on the model or Cortex function specified.

TRY\_COMPLETE (SNOWFLAKE.CORTEX): Works like the COMPLETE function, but returns NULL when the function could not execute instead of an error code.

Cortex Guard  
Cortex Guard is an option of the COMPLETE function designed to filter possible unsafe and harmful responses from a language model. Cortex Guard is currently built with Meta’s Llama Guard 3\. Cortex Guard works by evaluating the responses of a language model before that output is returned to the application. Once you activate Cortex Guard, language model responses which may be associated with violent crimes, hate, sexual content, self-harm, and more are automatically filtered. See COMPLETE arguments for syntax and examples.

Note

Usage of Cortex Guard incurs compute charges based on the number of input tokens processed.

Performance considerations  
Cortex AISQL Functions are optimized for throughput. We recommend using these functions to process numerous inputs such as text from large SQL tables. Batch processing is typically better suited for AISQL Functions. For more interactive use cases where latency is important, use the REST API. These are available for simple inference (Complete API), embedding (Embed API) and agentic applications (Agents API).

Required privileges  
The CORTEX\_USER database role in the SNOWFLAKE database includes the privileges that allow users to call Snowflake Cortex AI functions. By default, the CORTEX\_USER role is granted to the PUBLIC role. The PUBLIC role is automatically granted to all users and roles, so this allows all users in your account to use the Snowflake Cortex AI functions.

If you don’t want all users to have this privilege, you can revoke access to the PUBLIC role and grant access to specific roles.

To revoke the CORTEX\_USER database role from the PUBLIC role, run the following commands using the ACCOUNTADMIN role:

REVOKE DATABASE ROLE SNOWFLAKE.CORTEX\_USER  
  FROM ROLE PUBLIC;

REVOKE IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE  
  FROM ROLE PUBLIC;  
You can then selectively provide access to specific roles. The SNOWFLAKE.CORTEX\_USER database role cannot be granted directly to a user. For more information, see Using SNOWFLAKE database roles. A user with the ACCOUNTADMIN role can grant this role to a custom role in order to allow users to access Cortex AI functions. In the following example, use the ACCOUNTADMIN role and grant the user some\_user the CORTEX\_USER database role via the account role cortex\_user\_role, which you create for this purpose.

USE ROLE ACCOUNTADMIN;

CREATE ROLE cortex\_user\_role;  
GRANT DATABASE ROLE SNOWFLAKE.CORTEX\_USER TO ROLE cortex\_user\_role;

GRANT ROLE cortex\_user\_role TO USER some\_user;  
You can also grant access to Snowflake Cortex AI functions through existing roles commonly used by specific groups of users. (See User roles.) For example, if you have created an analyst role that is used as a default role by analysts in your organization, you can easily grant these users access to Snowflake Cortex AISQL functions with a single GRANT statement.

GRANT DATABASE ROLE SNOWFLAKE.CORTEX\_USER TO ROLE analyst;  
Control model access  
Snowflake Cortex provides two independent mechanisms to enforce model access:

Account-level allowlist parameter (simple, broad control)

Role-based access control (RBAC) (fine-grained control)

You can use the account-level allowlist to control model access across your entire account, or you can use RBAC to control model access on a per-role basis. For maximum flexibility, you can also use both mechanisms together, if you can accept additional complexity.

Account-level allowlist parameter  
You can control model access across your entire account using the CORTEX\_MODELS\_ALLOWLIST parameter. Supported features will respect the value of this parameter and prevent use of models that are not in the allowlist.

The CORTEX\_MODELS\_ALLOWLIST parameter can be set to 'All', 'None', or to a comma-separated list of model names. This parameter can only be set at the account level, not at the user or session levels. Only the ACCOUNTADMIN role can set the parameter using the ALTER ACCOUNT command.

Examples:

To allow access to all models:

ALTER ACCOUNT SET CORTEX\_MODELS\_ALLOWLIST \= 'All';  
To allow access to the mistral-large2 and llama3.1-70b models:

ALTER ACCOUNT SET CORTEX\_MODELS\_ALLOWLIST \= 'mistral-large2,llama3.1-70b';  
To prevent access to any model:

ALTER ACCOUNT SET CORTEX\_MODELS\_ALLOWLIST \= 'None';  
Use RBAC, as described in the following section, to provide specific roles with access beyond what you’ve specified in the allowlist.

Role-based access control (RBAC)  
Although Cortex models are not themselves Snowflake objects, Snowflake lets you create model objects in the SNOWFLAKE.MODELS schema that represent the Cortex models. By applying RBAC to these objects, you can control access to models the same way you would any other Snowflake object. Supported features accept the identifiers of objects in SNOWFLAKE.MODELS wherever a model can be specified.

Tip

To use RBAC exclusively, set CORTEX\_MODELS\_ALLOWLIST to 'None'.

Refresh model objects and application roles  
SNOWFLAKE.MODELS is not automatically populated with the objects that represent Cortex models. You must create these objects when you first set up model RBAC, and refresh them when you want to apply RBAC to new models.

As ACCOUNTADMIN, run the SNOWFLAKE.MODELS.CORTEX\_BASE\_MODELS\_REFRESH stored procedure to populate the SNOWFLAKE.MODELS schema with objects representing currently available Cortex models, and to create application roles that correspond to the models. The procedure also creates CORTEX-MODEL-ROLE-ALL a role that covers all models.

Tip

You can safely call CORTEX\_BASE\_MODELS\_REFRESH at any time; it will not create duplicate objects or roles.

CALL SNOWFLAKE.MODELS.CORTEX\_BASE\_MODELS\_REFRESH();  
After refreshing the model objects, you can verify that the models appear in the SNOWFLAKE.MODELS schema as follows:

SHOW MODELS IN SNOWFLAKE.MODELS;  
The returned list of models resembles the following:

created\_on

name

model\_type

database\_name

schema\_name

owner

2025-04-22 09:35:38.558 \-0700

CLAUDE-3-5-SONNET

CORTEX\_BASE

SNOWFLAKE

MODELS

SNOWFLAKE

2025-04-22 09:36:16.793 \-0700

LLAMA3.1-405B

CORTEX\_BASE

SNOWFLAKE

MODELS

SNOWFLAKE

2025-04-22 09:37:18.692 \-0700

SNOWFLAKE-ARCTIC

CORTEX\_BASE

SNOWFLAKE

MODELS

SNOWFLAKE

To verify that you can see the application roles associated with these models, use the SHOW APPLICATION ROLES command, as in the following example:

SHOW APPLICATION ROLES IN APPLICATION SNOWFLAKE;  
The list of application roles resembles the following:

created\_on

name

owner

comment

owner\_role\_type

2025-04-22 09:35:38.558 \-0700

CORTEX-MODEL-ROLE-ALL

SNOWFLAKE

MODELS

APPLICATION

2025-04-22 09:36:16.793 \-0700

CORTEX-MODEL-ROLE-LLAMA3.1-405B

SNOWFLAKE

MODELS

APPLICATION

2025-04-22 09:37:18.692 \-0700

CORTEX-MODEL-ROLE-SNOWFLAKE-ARCTIC

SNOWFLAKE

MODELS

APPLICATION

Grant application roles to user roles  
After you create the model objects and application roles, you can grant the application roles to specific user roles in your account.

To grant a role access to a specific model:

GRANT APPLICATION ROLE SNOWFLAKE."CORTEX-MODEL-ROLE-LLAMA3.1-70B" TO ROLE MY\_ROLE;  
To grant a role access to all models (current and future models):

GRANT APPLICATION ROLE SNOWFLAKE."CORTEX-MODEL-ROLE-ALL" TO ROLE MY\_ROLE;  
Use model objects with supported features  
To use model objects with supported Cortex features, specify the identifier of the model object in SNOWFLAKE.MODELS as the model argument. You can use either a qualified identifier or a partial identifier, depending on your current database and schema context.

Using a fully-qualified identifier:

SELECT AI\_COMPLETE('SNOWFLAKE.MODELS."LLAMA3.1-70B"', 'Hello');  
Using a partial identifier:

USE DATABASE SNOWFLAKE;  
USE SCHEMA MODELS;  
SELECT AI\_COMPLETE('LLAMA3.1-70B', 'Hello');  
Using RBAC with account-level allowlist  
A number of Cortex features accept a model name as a string argument, for example AI\_COMPLETE('model', 'prompt'). Cortex first treats this as the identifier of a schema-level model object. If the model object is found, RBAC is applied to determine whether the user can use the model. If no model object is found, the argument is interpreted as a plain model name and matched against the account-level allowlist.

The following example illustrates the use of allowlist and RBAC together. In this example, the allowlist is set to allow the mistral-large2 model, and the user has access to the LLAMA3.1-70B model object through RBAC.

\-- set up access  
USE SECONDARY ROLES NONE;  
USE ROLE ACCOUNTADMIN;  
ALTER ACCOUNT SET CORTEX\_MODELS\_ALLOWLIST \= 'MISTRAL-LARGE2';  
CALL SNOWFLAKE.MODELS.CORTEX\_BASE\_MODELS\_REFRESH();  
GRANT APPLICATION ROLE SNOWFLAKE."CORTEX-MODEL-ROLE-LLAMA3.1-70B" TO ROLE PUBLIC;

\-- test access  
USE ROLE PUBLIC;

\-- this succeeds because mistral-large2 is in the allowlist  
SELECT AI\_COMPLETE('MISTRAL-LARGE2', 'Hello');

\-- this succeeds because the role has access to the model object  
SELECT AI\_COMPLETE('SNOWFLAKE.MODELS."LLAMA3.1-70B"', 'Hello');

\-- this fails because the first argument is  
\-- neither an identifier for an accessible model object  
\-- nor is it a model name in the allowlist  
SELECT AI\_COMPLETE('SNOWFLAKE-ARCTIC', 'Hello');  
Common pitfalls  
Access to a model (whether by allowlist or RBAC) does not always mean that it can be used. It may still be subject to cross-region, deprecation, or other availability constraints. These restrictions can result in error messages that seem similar to model access errors.

Model access controls only govern use of a model, and not the use of a feature itself, which may have its own access controls. For example, access to AI\_COMPLETE is governed by the CORTEX\_USER database role. See Required privileges for more information.

Not all features support model access controls. See the supported features table to see which access control methods a given feature supports.

Secondary roles can obscure permissions. For example, if a user has ACCOUNTADMIN as a secondary role, all model objects may appear accessible. Disable secondary roles temporarily when verifying permissions.

Keep in mind that you must use model object identifiers with RBAC and that these are quoted identifiers and are therefore case-sensitive. See QUOTED\_IDENTIFIERS\_IGNORE\_CASE for more information.

Supported features  
Model access controls are supported by the following features:

Feature

Account-level allowlist

Role-based access control

Notes

AI\_COMPLETE

✔

✔

AI\_CLASSIFY

✔

If the model powering this function is not allowed, the error message contains information about how to modify the allowlist.

AI\_FILTER

✔

If the model powering this function is not allowed, the error message contains information about how to modify the allowlist.

AI\_AGG

✔

If the model powering this function is not allowed, the error message contains information about how to modify the allowlist.

AI\_SUMMARIZE\_AGG

✔

If the model powering this function is not allowed, the error message contains information about how to modify the allowlist.

COMPLETE (SNOWFLAKE.CORTEX)

✔

✔

TRY\_COMPLETE (SNOWFLAKE.CORTEX)

✔

✔

Cortex REST API

✔

✔

Cortex Playground

✔

✔

Availability  
Snowflake Cortex AI functions are currently available natively in the following regions. If your region is not listed for a particular function, use cross-region inference.

Note

The TRY\_COMPLETE function is available in the same regions as COMPLETE.

The COUNT\_TOKENS function is available in all regions for any model, but the models themselves are available only in the regions specified in the tables below.

Cross-Region  
North America  
Europe  
Asia Pacific  
The following models are available in any region via cross-region inference.

Function  
(Model)  
Cross Cloud (Any Region)  
AWS US  
(Cross-Region)  
AWS EU  
(Cross-Region)  
AWS APJ  
(Cross-Region)  
Azure US  
(Cross-Region)  
COMPLETE  
(claude-4-sonnet)  
✔

✔

COMPLETE  
(claude-4-opus)  
In preview

In preview

COMPLETE  
(claude-3-7-sonnet)  
✔

✔

✔

COMPLETE  
(claude-3-5-sonnet)  
✔

✔

COMPLETE  
(llama4-maverick)  
✔

✔

COMPLETE  
(llama4-scout)  
✔

✔

COMPLETE  
(llama3.2-1b)  
✔

✔

COMPLETE  
(llama3.2-3b)  
✔

✔

COMPLETE  
(llama3.1-8b)  
✔

✔

✔

✔

✔

COMPLETE  
(llama3.1-70b)  
✔

✔

✔

✔

✔

COMPLETE  
(llama3.3-70b)  
✔

✔

COMPLETE  
(snowflake-llama-3.3-70b)  
✔

✔

COMPLETE  
(llama3.1-405b)  
✔

✔

✔

COMPLETE  
(openai-gpt-4.1)  
In preview

In preview

COMPLETE  
(openai-o4-mini)  
In preview

In preview

COMPLETE  
(openai-gpt-5)  
In preview

In preview

COMPLETE  
(openai-gpt-5-mini)  
In preview

In preview

COMPLETE  
(openai-gpt-5-nano)  
In preview

In preview

COMPLETE  
(openai-gpt-5-chat)  
In preview

COMPLETE  
(openai-gpt-oss-120b)  
In preview

COMPLETE  
(openai-gpt-oss-20b)  
In preview

COMPLETE  
(snowflake-llama-3.1-405b)  
✔

✔

COMPLETE  
(snowflake-arctic)  
✔

✔

✔

COMPLETE  
(deepseek-r1)  
✔

✔

COMPLETE  
(reka-core)  
✔

✔

COMPLETE  
(reka-flash)  
✔

✔

✔

COMPLETE  
(mistral-large2)  
✔

✔

✔

✔

COMPLETE  
(mixtral-8x7b)  
✔

✔

✔

✔

✔

COMPLETE  
(mistral-7b)  
✔

✔

✔

✔

✔

COMPLETE  
(jamba-instruct)  
✔

✔

✔

✔

✔

COMPLETE  
(jamba-1.5-mini)  
✔

✔

✔

✔

✔

COMPLETE  
(jamba-1.5-large)  
✔

✔

✔

COMPLETE  
(gemma-7b)  
✔

✔

✔

✔

EMBED\_TEXT\_768  
(e5-base-v2)  
✔

✔

✔

✔

✔

EMBED\_TEXT\_768  
(snowflake-arctic-embed-m)  
✔

✔

✔

✔

✔

EMBED\_TEXT\_768  
(snowflake-arctic-embed-m-v1.5)  
✔

✔

✔

✔

✔

EMBED\_TEXT\_1024  
(snowflake-arctic-embed-l-v2.0)  
✔

✔

✔

✔

✔

EMBED\_TEXT\_1024  
(snowflake-arctic-embed-l-v2.0-8k)  
✔

✔

✔

✔

✔

EMBED\_TEXT\_1024  
(nv-embed-qa-4)  
✔

✔

EMBED\_TEXT\_1024  
(multilingual-e5-large)  
✔

✔

✔

✔

✔

EMBED\_TEXT\_1024  
(voyage-multilingual-2)  
✔

✔

✔

✔

✔

AI\_CLASSIFY TEXT  
✔

✔

✔

✔

✔

AI\_CLASSIFY IMAGE  
✔

AI\_FILTER TEXT  
✔

✔

✔

✔

✔

AI\_FILTER IMAGE  
✔

AI\_AGG  
✔

✔

✔

✔

✔

AI\_SENTIMENT  
✔

✔

✔

✔

✔

AI\_SIMILARITY TEXT  
✔

✔

✔

✔

✔

AI\_SIMILARITY IMAGE  
✔

✔

✔

AI\_SUMMARIZE\_AGG  
✔

✔

✔

✔

✔

EXTRACT\_ANSWER  
✔

✔

✔

✔

✔

SENTIMENT  
✔

✔

✔

✔

✔

ENTITY\_SENTIMENT  
✔

✔

✔

✔

✔

SUMMARIZE  
✔

✔

✔

✔

✔

TRANSLATE  
✔

✔

✔

✔

✔

The following Snowflake Cortex AI functions are currently available in the following extended regions.

Function  
(Model)  
AWS US East 2  
(Ohio)  
AWS CA Central 1  
(Central)  
AWS SA East 1  
(São Paulo)  
AWS Europe West 2  
(London)  
AWS Europe Central 1  
(Frankfurt)  
AWS Europe North 1  
(Stockholm)  
AWS AP Northeast 1  
(Tokyo)  
AWS AP South 1  
(Mumbai)  
AWS AP Southeast 2  
(Sydney)  
AWS AP Southeast 3  
(Jakarta)  
Azure South Central US  
(Texas)  
Azure West US 2  
(Washington)  
Azure UK South  
(London)  
Azure North Europe  
(Ireland)  
Azure Switzerland North  
(Zürich)  
Azure Central India  
(Pune)  
Azure Japan East  
(Tokyo, Saitama)  
Azure Southeast Asia  
(Singapore)  
Azure Australia East  
(New South Wales)  
GCP Europe West 2  
(London)  
GCP Europe West 4  
(Netherlands)  
GCP US Central 1  
(Iowa)  
GCP US East 4  
(N. Virginia)  
EMBED\_TEXT\_768  
(snowflake-arctic-embed-m-v1.5)  
✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

EMBED\_TEXT\_768  
(snowflake-arctic-embed-m)  
✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

EMBED\_TEXT\_1024  
(multilingual-e5-large)  
✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

The following table lists legacy models. If you’re just getting started, start with models in the previous tables.

Legacy  
Function  
(Model)  
AWS US West 2  
(Oregon)  
AWS US East 1  
(N. Virginia)  
AWS Europe Central 1  
(Frankfurt)  
AWS Europe West 1  
(Ireland)  
AWS AP Southeast 2  
(Sydney)  
AWS AP Northeast 1  
(Tokyo)  
Azure East US 2  
(Virginia)  
Azure West Europe  
(Netherlands)  
COMPLETE  
(llama2-70b-chat)  
✔

✔

✔

✔

✔

COMPLETE  
(llama3-8b)  
✔

✔

✔

✔

✔

✔

COMPLETE  
(llama3-70b)  
✔

✔

✔

✔

✔

COMPLETE  
(mistral-large)  
✔

✔

✔

✔

✔

Cost considerations  
Snowflake Cortex AI functions incur compute cost based on the number of tokens processed. Refer to the Snowflake Service Consumption Table for each function’s cost in credits per million tokens.

A token is the smallest unit of text processed by Snowflake Cortex AI functions, approximately equal to four characters of text. The equivalence of raw input or output text to tokens can vary by model.

For functions that generate new text in the response (AI\_COMPLETE, AI\_CLASSIFY, AI\_FILTER, AI\_AGG, AI\_SUMMARIZE, and TRANSLATE), both input and output tokens are counted.

For Cortex Guard, only input tokens are counted. The number of input tokens is based on the number of output tokens per LLM model used in the COMPLETE function.

For AI\_SIMILARITY and the EMBED\_\* functions, only input tokens are counted.

For EXTRACT\_ANSWER, the number of billable tokens is the sum of the number of tokens in the from\_text and question fields.

AI\_CLASSIFY, AI\_FILTER, AI\_AGG, AI\_SENTIMENT, AI\_SUMMARIZE\_AGG, SUMMARIZE, TRANSLATE, EXTRACT\_ANSWER, ENTITY\_SENTIMENT, and SENTIMENT add a prompt to the input text in order to generate the response. As a result, the input token count is higher than the number of tokens in the text you provide.

AI\_CLASSIFY labels, descriptions, and examples are counted as input tokens for each record processed, not just once for each AI\_CLASSIFY call.

For PARSE\_DOCUMENT (SNOWFLAKE.CORTEX), billing is based on the number of document pages processed.

TRY\_COMPLETE (SNOWFLAKE.CORTEX) does not incur costs for error handling. This means that if the TRY\_COMPLETE(SNOWFLAKE.CORTEX) function returns NULL, no cost is incurred.

COUNT\_TOKENS (SNOWFLAKE.CORTEX) incurs only compute cost to run the function. No additional token based costs are incurred.

For models that support media files such as images or audio:

Audio files are billed at 50 tokens per second of audio.

The token equivalence of images is determined by the model used. For more information, see AI Image cost considerations.

Snowflake recommends executing queries that call a Snowflake Cortex AISQL function or a Cortex PARSE\_DOCUMENT function with a smaller warehouse (no larger than MEDIUM) because larger warehouses do not increase performance. The cost associated with keeping a warehouse active will continue to apply when executing a query that calls a Snowflake Cortex LLM Function. For general information on compute costs, see Understanding compute cost.

Track costs for AI services  
To track credits used for AI Services including LLM Functions in your account, use the METERING\_HISTORY view:

SELECT \*  
  FROM SNOWFLAKE.ACCOUNT\_USAGE.METERING\_DAILY\_HISTORY  
  WHERE SERVICE\_TYPE='AI\_SERVICES';  
Track credit consumption for AISQL functions  
To view the credit and token consumption for each AISQL function call, use the CORTEX\_FUNCTIONS\_USAGE\_HISTORY view:

SELECT \*  
  FROM SNOWFLAKE.ACCOUNT\_USAGE.CORTEX\_FUNCTIONS\_USAGE\_HISTORY;  
You can also view the credit and token consumption for each query within your Snowflake account. Viewing the credit and token consumption for each query helps you identify queries that are consuming the most credits and tokens.

The following example query uses the CORTEX\_FUNCTIONS\_QUERY\_USAGE\_HISTORY view to show the credit and token consumption for all of your queries within your account.

SELECT \* FROM SNOWFLAKE.ACCOUNT\_USAGE.CORTEX\_FUNCTIONS\_QUERY\_USAGE\_HISTORY;  
You can also use the same view to see the credit and token consumption for a specific query.

SELECT \* FROM SNOWFLAKE.ACCOUNT\_USAGE.CORTEX\_FUNCTIONS\_QUERY\_USAGE\_HISTORY  
WHERE query\_id='\<query-id\>';  
Note

You can’t get granular usage information for requests made with the REST API.

The query usage history is grouped by the models used in the query. For example, if you ran:

SELECT AI\_COMPLETE('mistral-7b', 'Is a hot dog a sandwich'), AI\_COMPLETE('mistral-large', 'Is a hot dog a sandwich');  
The query usage history would show two rows, one for mistral-7b and one for mistral-large.

Usage quotas  
Note

On-demand Snowflake accounts without a valid payment method (such as trial accounts) are limited to 10 credits per day for Snowflake Cortex AISQL usage. To remove this limit, see convert your trial account to a paid account.

Managing costs  
Snowflake recommends using a warehouse size no larger than MEDIUM when calling Snowflake Cortex AISQL functions. Using a larger warehouse than necessary does not increase performance, but can result in unnecessary costs. This recommendation might not apply in the future due to upcoming product updates.

Model restrictions  
Models used by Snowflake Cortex have limitations on size as described in the table below. Sizes are given in tokens. Tokens generally represent about four characters of text, so the number of words corresponding to a limit is less than the number of tokens. Inputs that exceed the limit result in an error.

The maximum size of the output that a model can produce is limited by the following:

The model’s output token limit.

The space available in the context window after the model consumes the input tokens.

For example, claude-3-5-sonnet has a context window of 200,000 tokens. If 100,000 tokens are used for the input, the model can generate up to 8,192 tokens. However, if 195,000 tokens are used as input, then the model can only generate up to 5,000 tokens for a total of 200,000 tokens.

Important

In the AWS AP Southeast 2 (Sydney) region:

the context window for llama3-8b and mistral-7b is 4,096 tokens.

the context window for llama3.1-8b is 16,384 tokens.

the context window for the Snowflake managed model from the SUMMARIZE function is 4,096 tokens.

In the AWS Europe West 1 (Ireland) region:

the context window for llama3.1-8b is 16,384 tokens.

the context window for mistral-7b is 4,096 tokens.

Function

Model

Context window (tokens)

Max output AISQL functions (tokens)

COMPLETE

llama4-maverick

128,000

8,192

llama4-scout

128,000

8,192

snowflake-arctic

4,096

8,192

deepseek-r1

32,768

8,192

claude-4-opus

200,000

8,192

claude-4-sonnet

200,000

32,000

claude-3-7-sonnet

200,000

32,000

claude-3-5-sonnet

200,000

8,192

mistral-large

32,000

8,192

mistral-large2

128,000

8,192

openai-gpt-4.1

128,000

32,000

openai-o4-mini

200,000

32,000

openai-gpt-5

272,000

8,192

openai-gpt-5-mini

272,000

8,192

openai-gpt-5-nano

272,000

8,192

openai-gpt-5-chat

128,000

8,192

openai-gpt-oss-120b

128,000

8,192

openai-gpt-oss-20b

128,000

8,192

reka-flash

100,000

8,192

reka-core

32,000

8,192

jamba-instruct

256,000

8,192

jamba-1.5-mini

256,000

8,192

jamba-1.5-large

256,000

8,192

mixtral-8x7b

32,000

8,192

llama2-70b-chat

4,096

8,192

llama3-8b

8,000

8,192

llama3-70b

8,000

8,192

llama3.1-8b

128,000

8,192

llama3.1-70b

128,000

8,192

llama3.3-70b

128,000

8,192

snowflake-llama-3.3-70b

8,000

8,192

llama3.1-405b

128,000

8,192

snowflake-llama-3.1-405b

8,000

8,192

llama3.2-1b

128,000

8,192

llama3.2-3b

128,000

8,192

mistral-7b

32,000

8,192

gemma-7b

8,000

8,192

EMBED\_TEXT\_768

e5-base-v2

512

n/a

snowflake-arctic-embed-m

512

n/a

EMBED\_TEXT\_1024

nv-embed-qa-4

512

n/a

multilingual-e5-large

512

n/a

voyage-multilingual-2

32,000

n/a

AI\_FILTER

Snowflake managed model

128,000

n/a

AI\_CLASSIFY / CLASSIFY\_TEXT

Snowflake managed model

128,000

n/a

AI\_AGG

Snowflake managed model

128,000 per row  
can be used across multiple rows  
8,192

AI\_SENTIMENT

Snowflake managed model

2,048

n/a

AI\_SUMMARIZE\_AGG

Snowflake managed model

128,000 per row  
can be used across multiple rows  
8,192

ENTITY\_SENTIMENT

Snowflake managed model

2,048

n/a

EXTRACT\_ANSWER

Snowflake managed model

2,048 for text  
64 for question  
n/a

SENTIMENT

Snowflake managed model

512

n/a

SUMMARIZE

Snowflake managed model

32,000

4,096

TRANSLATE

Snowflake managed model

4,096

n/a

Choosing a model  
The Snowflake Cortex COMPLETE function supports multiple models of varying capability, latency, and cost. These models have been carefully chosen to align with common customer use cases. To achieve the best performance per credit, choose a model that’s a good match for the content size and complexity of your task. Here are brief overviews of the available models.

Large models  
If you’re not sure where to start, try the most capable models first to establish a baseline to evaluate other models. claude-3-7-sonnet, reka-core, and mistral-large2 are the most capable models offered by Snowflake Cortex, and will give you a good idea what a state-of-the-art model can do.

Claude 3-7 Sonnet is a leader in general reasoning and multimodal capabilities. It outperforms its predecessors in tasks that require reasoning across different domains and modalities. You can use its large output capacity to get more information from either structured or unstructured queries. Its reasoning capabilities and large context windows make it well-suited for agentic workflows.

deepseek-r1 is a foundation model trained using large-scale reinforcement-learning (RL) without supervised fine-tuning (SFT). It can deliver high performance across math, code, and reasoning tasks. To access the model, set the cross-region inference parameter to AWS\_US.

mistral-large2 is Mistral AI’s most advanced large language model with top-tier reasoning capabilities. Compared to mistral-large, it’s significantly more capable in code generation, mathematics, reasoning, and provides much stronger multilingual support. It’s ideal for complex tasks that require large reasoning capabilities or are highly specialized, such as synthetic text generation, code generation, and multilingual text analytics.

llama3.1-405b is an open source model from the llama3.1 model family from Meta with a large 128K context window. It excels in long document processing, multilingual support, synthetic data generation and model distillation.

snowflake-llama3.1-405b is a model derived from the open source llama3.1 model. It uses the \<SwiftKV optimizations https://www.snowflake.com/en/blog/up-to-75-lower-inference-cost-llama-meta-llm/\> that have been developed by the Snowflake AI research team to deliver up to a 75% inference cost reduction. SwiftKV achieves higher throughput performance with minimal accuracy loss.

Medium models  
llama3.1-70b is an open source model that demonstrates state-of-the-art performance ideal for chat applications, content creation, and enterprise applications. It is a highly performant, cost effective model that enables diverse use cases with a context window of 128K. llama3-70b is still supported and has a context window of 8K.

snowflake-llama3.3-70b is a model derived from the open source llama3.3 model. It uses the \<SwiftKV optimizations https://www.snowflake.com/en/blog/up-to-75-lower-inference-cost-llama-meta-llm/\> developed by the Snowflake AI research team to deliver up to a 75% inference cost reduction. SwiftKV achieves higher throughput performance with minimal accuracy loss.

snowflake-arctic is Snowflake’s top-tier enterprise-focused LLM. Arctic excels at enterprise tasks such as SQL generation, coding and instruction following benchmarks.

mixtral-8x7b is ideal for text generation, classification, and question answering. Mistral models are optimized for low latency with low memory requirements, which translates into higher throughput for enterprise use cases.

The jamba-Instruct model is built by AI21 Labs to efficiently meet enterprise requirements. It is optimized to offer a 256k token context window with low cost and latency, making it ideal for tasks like summarization, Q\&A, and entity extraction on lengthy documents and extensive knowledge bases.

The AI21 Jamba 1.5 family of models is state-of-the-art, hybrid SSM-Transformer instruction following foundation models. The jamba-1.5-mini and jamba-1.5-large with a context length of 256K supports use cases such as structured output (JSON), and grounded generation.

Small models  
The llama3.2-1b and llama3.2-3b models support context length of 128K tokens and are state-of-the-art in their class for use cases like summarization, instruction following, and rewriting tasks. The Llama 3.2 models deliver multilingual capabilities, with support for English, German, French, Italian, Portuguese, Hindi, Spanish and Thai.

llama3.1-8b is ideal for tasks that require low to moderate reasoning. It’s a light-weight, ultra-fast model with a context window of 128K. llama3-8b and llama2-70b-chat are still supported models that provide a smaller context window and relatively lower accuracy.

mistral-7b is ideal for your simplest summarization, structuration, and question answering tasks that need to be done quickly. It offers low latency and high throughput processing for multiple pages of text with its 32K context window.

gemma-7b is suitable for simple code and text completion tasks. It has a context window of 8,000 tokens but is surprisingly capable within that limit, and quite cost-effective.

The following table provides information on how popular models perform on various benchmarks, including the models offered by Snowflake Cortex COMPLETE as well as a few other popular models.

Model

Context Window  
(Tokens)  
MMLU  
(Reasoning)  
HumanEval  
(Coding)  
GSM8K  
(Arithmetic Reasoning)  
Spider 1.0  
(SQL)  
GPT 4.o

128,000

88.7

90.2

96.4

\-

Claude 3.5 Sonnet

200,000

88.3

92.0

96.4

\-

llama3.1-405b

128,000

88.6

89

96.8

\-

reka-core

32,000

83.2

76.8

92.2

\-

llama3.1-70b

128,000

86

80.5

95.1

\-

mistral-large2

128,000

84

92

93

\-

reka-flash

100,000

75.9

72

81

\-

llama3.1-8b

128,000

73

72.6

84.9

\-

mixtral-8x7b

32,000

70.6

40.2

60.4

\-

jamba-instruct

256,000

68.2

40

59.9

\-

jamba-1.5-mini

256,000

69.7

\-

75.8

\-

jamba-1.5-large

256,000

81.2

\-

87

\-

Snowflake Arctic

4,096

67.3

64.3

69.7

79

llama3.2-1b

128,000

49.3

\-

44.4

\-

llama3.2-3b

128,000

69.4

\-

77.7

\-

gemma-7b

8,000

64.3

32.3

46.4

\-

mistral-7b

32,000

62.5

26.2

52.1

\-

GPT 3.5 Turbo\*

4,097

70

48.1

57.1

\-

Previous model versions  
The Snowflake Cortex COMPLETE function also supports the following older model versions. We recommend using the latest model versions instead of the versions listed in this table.

Model

Context Window  
(Tokens)  
MMLU  
(Reasoning)  
HumanEval  
(Coding)  
GSM8K  
(Arithmetic Reasoning)  
Spider 1.0  
(SQL)  
mistral-large

32,000

81.2

45.1

81

81

llama-2-70b-chat

4,096

68.9

30.5

57.5

\-

Using Snowflake Cortex AISQL with Python  
You can use Snowflake Cortex AISQL functions in the Snowpark Python API. Within the API, you can use the functions to classify, summarize, and filter both text and image data.

These functions include the following:

ai\_agg()

ai\_classify()

ai\_complete()

ai\_filter()

ai\_similarity()

ai\_summarize\_agg()

The ai\_agg() function aggregates a column of text using natural language instructions in a similar manner to how you would ask an analyst to summarize or extract findings from grouped or ungrouped data.

The following example summarizes customer reviews for each product using the ai\_agg() function. The function takes a column of text and a natural language instruction to summarize the reviews.

from snowflake.snowpark.functions import ai\_agg, col

df \= session.create\_dataframe(\[  
    \[1, "Excellent product\!"\],  
    \[1, "Great battery life."\],  
    \[1, "A bit expensive but worth it."\],  
    \[2, "Terrible customer service."\],  
    \[2, "Won’t buy again."\],  
\], schema=\["product\_id", "review"\])

\# Summarize reviews per product  
summary\_df \= df.group\_by("product\_id").agg(  
    ai\_agg(col("review"), "Summarize the customer reviews in one sentence.")  
)  
summary\_df.show()  
Note

Use task descriptions that are detailed and centered around the use case. For example, “Summarize the customer feedback for an investor report”.

The ai\_classify() function takes a text or image and classifies it into the categories that you define.

The following example classifies travel reviews into categories such as “travel” and “cooking”. The function takes a column of text and a list of categories to classify the text into.

from snowflake.snowpark.functions import ai\_classify, col

df \= session.create\_dataframe(\[  
    \["I dream of backpacking across South America."\],  
    \["I made the best pasta yesterday."\],  
\], schema=\["sentence"\])

df \= df.select(  
    "sentence",  
    ai\_classify(col("sentence"), \["travel", "cooking"\]).alias("classification")  
)  
df.show()  
Note

You can provide up to 500 categories. You can classify both text and images.

The ai\_filter() function evaluates a natural language condition and returns TRUE or FALSE. You can use it to filter or tag rows.

from snowflake.snowpark.functions import ai\_filter, prompt, col

df \= session.create\_dataframe(\["Canada", "Germany", "Japan"\], schema=\["country"\])

filtered\_df \= df.select(  
    "country",  
    ai\_filter(prompt("Is {0} in Asia?", col("country"))).alias("is\_in\_asia")  
)  
filtered\_df.show()  
Note

You can filter on both strings and files. For dynamic prompts, use the prompt() function. For more information, see Snowpark Python reference.

Existing Snowpark ML functions are still supported in Snowpark ML version 1.1.2 and later. See Using Snowflake ML Locally for instructions on setting up Snowpark ML.

If you run your Python script outside of Snowflake, you must create a Snowpark session to use these functions. See Connecting to Snowflake for instructions.

The following Python example illustrates calling Snowflake Cortex AI functions on single values:

from snowflake.cortex import Complete, ExtractAnswer, Sentiment, Summarize, Translate

text \= """  
    The Snowflake company was co-founded by Thierry Cruanes, Marcin Zukowski,  
    and Benoit Dageville in 2012 and is headquartered in Bozeman, Montana.  
"""

print(Complete("llama2-70b-chat", "how do snowflakes get their unique patterns?"))  
print(ExtractAnswer(text, "When was snowflake founded?"))  
print(Sentiment("I really enjoyed this restaurant. Fantastic service\!"))  
print(Summarize(text))  
print(Translate(text, "en", "fr"))  
You can pass options that affect the model’s hyperparameters when using the COMPLETE function. The following Python example illustrates calling the COMPLETE function with a modification of the maximum number of output tokens that the model can generate:

from snowflake.cortex import Complete,CompleteOptions

model\_options1 \= CompleteOptions(  
    {'max\_tokens':30}  
)

print(Complete("llama3.1-8b", "how do snowflakes get their unique patterns?", options=model\_options1))  
You can also call an AI function on a table column, as shown below. This example requires a session object (stored in session) and a table articles containing a text column abstract\_text, and creates a new column abstract\_summary containing a summary of the abstract.

from snowflake.cortex import Summarize  
from snowflake.snowpark.functions import col

article\_df \= session.table("articles")  
article\_df \= article\_df.withColumn(  
    "abstract\_summary",  
    Summarize(col("abstract\_text"))  
)  
article\_df.collect()  
Note

The advanced chat-style (multi-message) form of COMPLETE is not currently supported in Python.

Using Snowflake Cortex AI functions with Snowflake CLI  
Snowflake Cortex AISQL is available in Snowflake CLI version 2.4.0 and later. See Introducing Snowflake CLI for more information about using Snowflake CLI.

The following examples illustrate using the snow cortex commands on single values. The \-c parameter specifies which connection to use.

Note

The advanced chat-style (multi-message) form of COMPLETE is not currently supported in Snowflake CLI.

snow cortex complete "Is 5 more than 4? Please answer using one word without a period." \-c "snowhouse"  
snow cortex extract-answer "what is snowflake?" "snowflake is a company" \-c "snowhouse"  
snow cortex sentiment "Mary had a little Lamb" \-c "snowhouse"  
snow cortex summarize "John has a car. John's car is blue. John's car is old and John is thinking about buying a new car. There are a lot of cars to choose from and John cannot sleep because it's an important decision for John."  
snow cortex translate herb \--to pl  
You can also use files that contain the text you want to use for the commands. For this example, assume that the file about\_cortex.txt contains the following content:

Snowflake Cortex gives you instant access to industry-leading large language models (LLMs) trained by researchers at companies like Anthropic, Mistral, Reka, Meta, and Google, including Snowflake Arctic, an open enterprise-grade model developed by Snowflake.

Since these LLMs are fully hosted and managed by Snowflake, using them requires no setup. Your data stays within Snowflake, giving you the performance, scalability, and governance you expect.

Snowflake Cortex features are provided as SQL functions and are also available in Python. The available functions are summarized below.

COMPLETE: Given a prompt, returns a response that completes the prompt. This function accepts either a single prompt or a conversation with multiple prompts and responses.  
EMBED\_TEXT\_768: Given a piece of text, returns a vector embedding that represents that text.  
EXTRACT\_ANSWER: Given a question and unstructured data, returns the answer to the question if it can be found in the data.  
SENTIMENT: Returns a sentiment score, from \-1 to 1, representing the detected positive or negative sentiment of the given text.  
SUMMARIZE: Returns a summary of the given text.  
TRANSLATE: Translates given text from any supported language to any other.  
You can then execute the snow cortex summarize command by passing in the filename using the \--file parameter, as shown:

snow cortex summarize \--file about\_cortex.txt  
Snowflake Cortex offers instant access to industry-leading language models, including Snowflake Arctic, with SQL functions for completing prompts (COMPLETE), text embedding (EMBED\\\_TEXT\\\_768), extracting answers (EXTRACT\\\_ANSWER), sentiment analysis (SENTIMENT), summarizing text (SUMMARIZE), and translating text (TRANSLATE).  
For more information about these commands, see snow cortex commands.

Legal notices  
The data classification of inputs and outputs are as set forth in the following table.

Input data classification

Output data classification

Designation

Usage Data

Customer Data

Generally available functions are Covered AI Features. Preview functions are Preview AI Features. \[1\]

\[1\]  
Represents the defined term used in the AI Terms and Acceptable Use Policy.

For additional information, refer to Snowflake AI and ML.

Apply AI on data using Databricks AI Functions  
Preview  
This feature is in Public Preview.

This article describes Databricks AI Functions and the supported functions.

What are AI Functions?  
AI Functions are built-in functions that you can use to apply AI, like text translation or sentiment analysis, on your data that is stored on Databricks. They can be run from anywhere on Databricks, including Databricks SQL, notebooks, Lakeflow Declarative Pipelines, and Workflows.

AI Functions are simple to use, fast, and scalable. Analysts can use them to apply data intelligence to their proprietary data, while data scientists and machine learning engineers can use them to build production-grade batch pipelines.

AI Functions provide general purpose and task-specific functions.

ai\_query is a general-purpose function that allows you to apply any type of AI model on your data. See General purpose function: ai\_query.  
Task-specific functions provide high-level AI capabilities for tasks like summarizing text and translation. These task-specific functions are powered by state of the art generative AI models that are hosted and managed by Databricks. See Task-specific AI functions for supported functions and models.  
General purpose function: ai\_query  
The ai\_query() function allows you to apply any AI model to data for both generative AI and classical ML tasks, including extracting information, summarizing content, identifying fraud, and forecasting revenue. For syntax details and parameters, see ai\_query function.

The following table summarizes the supported model types, the associated models, and model serving endpoint configuration requirements for each.

Type

Supported models

Requirements

Databricks-hosted foundation models optimized for AI Functions

These models are recommended for getting started with batch inference scenarios and production workflows:

databricks-gpt-oss-20b  
databricks-gpt-oss-120b  
databricks-gemma-3-12b  
databricks-llama-4-maverick  
databricks-meta-llama-3-3-70b-instruct  
databricks-meta-llama-3-1-8b-instruct  
databricks-gte-large-en  
Other Databricks-hosted models are available for use with AI Functions, but are not recommended for batch inference production workflows at scale.

Databricks Runtime 15.4 LTS or above is required to use this functionality. Requires no endpoint provisioning or configuration. Your use of these models is subject to the Applicable model developer licenses and terms and AI Functions region availability.

Fine-tuned foundation models

Fine-tuned foundation models deployed on Mosaic AI Model Serving

Requires you to create a provisioned throughput endpoint in Model Serving. See ai\_query and custom or fine-tuned foundation models.

Foundation models hosted outside of Databricks

Models made available using external models. See Access foundation models hosted outside of Databricks.

Requires you to create an external model serving endpoint.

Custom traditional ML and DL models

Any traditional ML or DL model, such as scikit-learn, xgboost, or PyTorch

Requires you to create a custom model serving endpoint.

Use ai\_query with foundation models  
The following example demonstrates how to use ai\_query using a foundation model hosted by Databricks.

See ai\_query function for syntax details and parameters.  
See Examples for advanced scenarios for guidance on how to configure parameters for advanced use cases.  
SQL

SELECT text, ai\_query(  
    "databricks-meta-llama-3-3-70b-instruct",  
    "Summarize the given text comprehensively, covering key points and main ideas concisely while retaining relevant details and examples. Ensure clarity and accuracy without unnecessary repetition or omissions: " || text  
) AS summary  
FROM uc\_catalog.schema.table;

Use ai\_query with traditional ML models  
ai\_query supports traditional ML models, including fully custom ones. These models must be deployed on Model Serving endpoints. For syntax details and parameters, see ai\_query function function.

SQL  
SELECT text, ai\_query(  
  endpoint \=\> "spam-classification",  
  request \=\> named\_struct(  
    "timestamp", timestamp,  
    "sender", from\_number,  
    "text", text),  
  returnType \=\> "BOOLEAN") AS is\_spam  
FROM catalog.schema.inbox\_messages  
LIMIT 10

Task-specific AI functions  
Task-specific functions are scoped for a certain task so you can automate routine actions, like simple summaries and quick translations. Databricks recommends these functions for getting started because they invoke a state-of-the-art generative AI model maintained by Databricks and do not require any customization.

See Analyze customer reviews using AI Functions for an example.

The following table lists the supported functions and what task they each perform.

Function

Description

ai\_analyze\_sentiment

Perform sentiment analysis on input text using a state-of-the-art generative AI model.

ai\_classify

Classify input text according to labels you provide using a state-of-the-art generative AI model.

ai\_extract

Extract entities specified by labels from text using a state-of-the-art generative AI model.

ai\_fix\_grammar

Correct grammatical errors in text using a state-of-the-art generative AI model.

ai\_gen

Answer the user-provided prompt using a state-of-the-art generative AI model.

ai\_mask

Mask specified entities in text using a state-of-the-art generative AI model.

ai\_parse\_document (Beta)

Extract structured content from unstructured documents using a state-of-the-art generative AI model.

ai\_similarity

Compare two strings and compute the semantic similarity score using a state-of-the-art generative AI model.

ai\_summarize

Generate a summary of text using SQL and state-of-the-art generative AI model.

ai\_translate

Translate text to a specified target language using a state-of-the-art generative AI model.

ai\_forecast

Forecast data up to a specified horizon. This table-valued function is designed to extrapolate time series data into the future.

vector\_search

Search and query a Mosaic AI Vector Search index using a state-of-the-art generative AI model.

Use AI Functions in existing Python workflows  
AI Functions can be easily integrated in existing Python workflows.

The following writes the output of the ai\_query to an output table:

Python  
df\_out \= df.selectExpr(  
  "ai\_query('databricks-meta-llama-3-3-70b-instruct', CONCAT('Please provide a summary of the following text: ', text), modelParameters \=\> named\_struct('max\_tokens', 100, 'temperature', 0.7)) as summary"  
)  
df\_out.write.mode("overwrite").saveAsTable('output\_table')

The following writes the summarized text into a table:

Python  
df\_summary \= df.selectExpr("ai\_summarize(text) as summary")  
df\_summary.write.mode('overwrite').saveAsTable('summarized\_table')

Use AI Functions in production workflows  
For large-scale batch inference, you can integrate task-specific AI functions, or the general purpose function ai\_query into your production workflows, like Lakeflow Declarative Pipelines, Databricks workflows and Structured Streaming. This enables production-grade processing at scale. See Perform batch LLM inference using AI Functions for examples and details.

Monitor AI Functions progress  
To understand how many inferences have completed or failed and troubleshoot performance, you can monitor the progress of AI functions using the query profile feature.

In Databricks Runtime 16.1 ML and above, from the SQL editor query window in your workspace:

Select the link, Running--- at the bottom of the Raw results window. The performance window appears on the right.  
Click See query profile to view performance details.  
Click AI Query to see metrics for that particular query including the number of completed and failed inferences and the total time the request took to complete.

