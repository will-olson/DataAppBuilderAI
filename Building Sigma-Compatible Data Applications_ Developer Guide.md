# **Building Sigma-Compatible Data Applications: Developer Guide**

## **Table of Contents**

1. Overview  
2. Architecture Principles  
3. Core Components  
4. Data Integration Layer  
5. Action System Implementation  
6. User Interface Framework  
7. AI Integration Capabilities  
8. Technical Implementation Guide  
9. Deployment and Integration  
10. Best Practices and Patterns

---

## **1\. Overview**

### **What Are Sigma-Compatible Data Applications?**

Sigma-compatible data applications represent a new paradigm in business intelligence \- interactive, workflow-driven applications that operate directly on cloud data warehouses while maintaining compatibility with Sigma's ecosystem. As a full-stack developer, you'll be building business process automation platforms rather than traditional reporting tools.

Key Distinction: Unlike traditional web applications that process data in application servers, Sigma-compatible apps push all data processing to the warehouse, creating seamless integration with Sigma workbooks and maintaining consistent data governance.

### **The Three Pillars of Sigma Compatibility**

Every Sigma-compatible data application must implement three fundamental components:

1\. Input Tables

* Live data collection and modification capabilities  
* Real-time synchronization with warehouse tables  
* Support for user-driven data entry and editing

2\. Layout Elements

* Sophisticated UI organization and workflow management  
* Responsive, grid-based container systems  
* Modal dialogs, tabs, and interactive components

3\. Actions

* Complex event-driven automation and business logic  
* Integration with warehouse stored procedures  
* AI-powered workflows and decision making

### **Core Value Proposition**

When combined with AI capabilities and warehouse-native processing, these components create applications that:

* Blur the line between data analysis and business process management  
* Maintain single source of truth in the data warehouse  
* Provide real-time collaboration capabilities  
* Scale automatically with warehouse compute resources

---

## **2\. Architecture Principles**

### **2.1 Event-Driven Architecture**

Sigma-compatible applications operate on an event-driven model where user interactions trigger action sequences that can:

* Modify data in real-time  
* Send notifications and alerts  
* Generate exports and reports  
* Call stored procedures  
* Execute AI queries and workflows

Architecture Diagram:

text  
┌─────────────────────────────────┐  
│     User Interface Layer        │  
│  ┌─────────┬─────────┬─────────┐ │  
│  │ React/  │ Layout  │ Input   │ │  
│  │ Vue     │ Elements│ Tables  │ │  
│  │ Components       │         │ │  
│  └─────────┴─────────┴─────────┘ │  
└─────────────┬───────────────────┘  
              │  
┌─────────────▼───────────────────┐  
│    Action Processing Layer      │  
│  ┌─────────┬─────────┬─────────┐ │  
│  │ Action  │Sequence │Condition│ │  
│  │ Engine  │Orchestr.│Evaluator│ │  
│  │         │         │& AI Eng.│ │  
│  └─────────┴─────────┴─────────┘ │  
└─────────────┬───────────────────┘  
              │  
┌─────────────▼───────────────────┐  
│  Data & Integration Layer       │  
│  ┌─────────┬─────────┬─────────┐ │  
│  │Write-Back│ Stored │Notification│  
│  │ Engine  │Procedure│& Export │ │  
│  │         │ Handler │ Engines │ │  
│  └─────────┴─────────┴─────────┘ │  
└─────────────┬───────────────────┘  
              │  
┌─────────────▼───────────────────┐  
│     Cloud Data Warehouse        │  
│  ┌─────────┬─────────┬─────────┐ │  
│  │ Data    │ SIGDS   │ AI      │ │  
│  │Warehouse│ Schema  │Functions│ │  
│  │ Tables  │& Stored │         │ │  
│  │         │Procedures│         │ │  
│  └─────────┴─────────┴─────────┘ │  
└─────────────────────────────────┘

### **2.2 Warehouse-Centric Design**

All processing happens in the warehouse:

* Computation: Performed using SQL and warehouse functions  
* AI Processing: Executed via warehouse-native AI functions (Snowflake Cortex, Databricks AI, BigQuery ML, etc.)  
* Data Storage: All application state stored in warehouse tables following SIGDS schema patterns  
* Business Logic: Implemented as stored procedures and warehouse functions

Benefits for developers:

* Simplified architecture with fewer moving parts  
* Automatic scaling with warehouse compute  
* Consistent data governance and security  
* Real-time data consistency across all applications

### **2.3 Real-Time Synchronization Requirements**

Your application must maintain real-time synchronization between:

* User interface state and interactions  
* Warehouse data (SIGDS schema tables)  
* Action execution results and side effects  
* Cross-element filtering and data relationships

---

## **3\. Core Components**

### **3.1 Input Tables: The Data Collection Foundation**

Input tables are the cornerstone of Sigma-compatible applications, enabling live data collection and modification. You must implement support for three distinct types:

#### **Empty Input Tables**

Standalone tables for new data collection and entry.

TypeScript Interface:

typescript  
interface EmptyInputTable {  
  type: 'empty';  
  columns: InputColumn\[\];  
  dataEntryPermission: 'draft' | 'published';  
  validation: ValidationRules;  
  governance: DataGovernanceConfig;  
  maxRows?: number;  
  allowBulkOperations: boolean;  
}

interface InputColumn {  
  name: string;  
  type: 'text' | 'number' | 'date' | 'datetime' | 'checkbox' | 'multi-select' | 'dropdown';  
  required: boolean;  
  validation?: ColumnValidation;  
  systemGenerated?: boolean; *// For created\_at, created\_by, etc.*  
  defaultValue?: any;  
}

#### **CSV Input Tables**

Pre-populated tables with file upload capabilities.

TypeScript Interface:

typescript  
interface CSVInputTable {  
  type: 'csv';  
  csvData: Buffer;  
  maxSize: 200; *// MB limit*  
  encoding: 'UTF-8';  
  columns: InputColumn\[\];  
  editableAfterUpload: boolean;  
  headerRow: boolean;  
  delimiter: ',' | ';' | '\\t';  
}

#### **Linked Input Tables**

Connected to existing warehouse data sources with augmentation capabilities.

TypeScript Interface:

typescript  
interface LinkedInputTable {  
  type: 'linked';  
  parentElement: string; *// Reference to source element*  
  primaryKeyColumn: string; *// Must be stable, unique identifiers*  
  linkedColumns: LinkedColumn\[\];  
  augmentationColumns: InputColumn\[\]; *// User-editable additional columns*  
}

interface LinkedColumn {  
  sourceColumn: string;  
  linkedColumn: string;  
  isEditable: false; *// Linked columns are read-only*  
}

### **3.2 Layout Elements: UI Organization System**

#### **Container System**

Grid-based responsive containers for organizing UI elements.

TypeScript Interface:

typescript  
interface Container {  
  type: 'container';  
  gridDensity: 6 | 12 | 24; *// Grid columns*  
  spacing: 'small' | 'medium' | 'large';  
  padding: boolean;  
  backgroundColor?: string;  
  border?: BorderConfig;  
  children: LayoutElement\[\];  
  nestingLevel: number; *// Maximum 4 levels deep*  
}

React Implementation Example:

typescript  
const SigmaContainer: React.FC\<ContainerProps\> \= ({   
  gridDensity \= 12,   
  spacing \= 'medium',   
  padding \= true,  
  children   
}) \=\> {  
  const spacingMap \= {  
    small: '8px',  
    medium: '16px',   
    large: '24px'  
  };

  return (  
    \<div   
      className\={\`sigma-container grid-${gridDensity} spacing-${spacing}\`}  
      style\={{   
        display: 'grid',  
        gridTemplateColumns: \`repeat(${gridDensity}, 1fr)\`,  
        gap: spacingMap\[spacing\],  
        padding: padding ? spacingMap\[spacing\] : 0  
      }}  
    \>  
      {children}  
    \</div\>  
  );  
};

#### **Modal System**

Overlay dialogs for focused workflows and data entry.

TypeScript Interface:

typescript  
interface Modal {  
  type: 'modal';  
  title: string;  
  width: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  
  showHeader: boolean;  
  showFooter: boolean;  
  primaryButton?: ButtonConfig;  
  secondaryButton?: ButtonConfig;  
  children: LayoutElement\[\];  
  onOpen?: ActionSequence;  
  onClose?: ActionSequence;  
}

React Implementation Example:

typescript  
const SigmaModal: React.FC\<ModalProps\> \= ({   
  isOpen,   
  title,   
  width \= 'md',   
  onPrimaryClick,  
  onSecondaryClick,  
  children   
}) \=\> {  
  if (\!isOpen) return null;  
    
  const widthMap \= {  
    xs: '320px',  
    sm: '480px',   
    md: '640px',  
    lg: '800px',  
    xl: '1024px'  
  };

  return (  
    \<div className\="sigma-modal-overlay" onClick\={handleOverlayClick}\>  
      \<div   
        className\={\`sigma-modal width-${width}\`}  
        style\={{ width: widthMap\[width\] }}  
      \>  
        \<header className\="sigma-modal-header"\>  
          \<h2\>{title}\</h2\>  
          \<button className\="close-icon" onClick\={onClose}\>×\</button\>  
        \</header\>  
        \<main className\="sigma-modal-content"\>  
          {children}  
        \</main\>  
        \<footer className\="sigma-modal-footer"\>  
          \<button onClick\={onSecondaryClick} className\="secondary"\>  
            Cancel  
          \</button\>  
          \<button onClick\={onPrimaryClick} className\="primary"\>  
            Submit  
          \</button\>  
        \</footer\>  
      \</div\>  
    \</div\>  
  );  
};

### **3.3 Actions: The Business Logic Engine**

Actions are the most complex component, supporting 15+ different action types for comprehensive workflow automation.

#### **Navigation Actions**

Control application flow and external link management.

TypeScript Interface:

typescript  
interface NavigationAction {  
  type: 'navigation';  
  subtype: 'open\_link' | 'open\_sigma\_doc' | 'navigate\_workbook';  
  target: string;  
  openIn: 'new\_window' | 'same\_window' | 'parent\_window';  
  dynamicURL?: boolean;  
  passControlValues?: ControlValueMapping\[\];  
}

#### **Control Management Actions**

Manage form controls and user input elements.

TypeScript Interface:

typescript  
interface ControlAction {  
  type: 'control';  
  subtype: 'set\_value' | 'clear\_value' | 'enable' | 'disable';  
  targetControl: string;  
  value?: StaticValue | ColumnValue | ControlValue | FormulaValue;  
  selectionMode: 'replace' | 'add' | 'remove';  
}

#### **AI Query Actions**

Execute warehouse-native AI functions and LLM operations.

TypeScript Interface:

typescript  
interface AIQueryAction {  
  type: 'ai\_query';  
  model: string; *// e.g., 'snowflake.cortex.complete', 'databricks.ai.complete'*  
  query: string;  
  parameters?: AIParameters;  
  outputVariable: string;  
  errorHandling: 'fail' | 'continue' | 'retry';  
}

# **4\. Action System Implementation**

The Action System is the core business logic engine of Sigma-compatible data applications. It orchestrates complex, conditional workflows that can modify data, send notifications, execute AI queries, call stored procedures, and manage UI state changes in real-time.

---

## **4.1 Action Sequence Orchestrator**

The orchestrator manages the execution of action sequences, handling conditions, error recovery, cross-action communication, and workflow state management.

### **Core Interfaces**

ActionSequence Interface:

typescript  
interface ActionSequence {  
  id: string;  
  name: string;  
  trigger: ActionTrigger;  
  condition?: ActionCondition;  
  actions: Action\[\];  
  isPaused: boolean;  
  stopOnError: boolean;  
  timeoutMs: number;  
}

interface ActionTrigger {  
  type: 'click' | 'select' | 'change' | 'context\_menu' | 'modal\_primary' | 'modal\_secondary' | 'modal\_close';  
  elementId: string;  
  columnName?: string; *// For table cell selections*  
  menuItemId?: string; *// For context menu triggers*  
}

interface ActionCondition {  
  type: 'custom\_formula' | 'control\_value' | 'selection\_value' | 'ai\_result';  
  formula?: string;  
  expectedValue?: any;  
  threshold?: number;  
}

### **Implementation**

ActionSequenceOrchestrator Class:

typescript  
class ActionSequenceOrchestrator {  
  private actionHandlers: Map\<string, ActionHandler\> \= new Map();  
  private activeSequences: Set\<string\> \= new Set();  
  private pausedSequences: Set\<string\> \= new Set();  
    
  constructor(  
    private variableManager: ActionVariableManager,  
    private auditLogger: AuditLogger,  
    private eventBus: EventBus  
  ) {  
    this.registerActionHandlers();  
  }  
    
  async executeSequence(sequence: ActionSequence, context: ActionContext): Promise\<void\> {  
    *// Prevent duplicate execution*  
    if (this.activeSequences.has(sequence.id)) {  
      console.warn(\`Action sequence ${sequence.id} is already executing\`);  
      return;  
    }  
      
    *// Check if sequence is paused*  
    if (this.pausedSequences.has(sequence.id)) {  
      console.info(\`Action sequence ${sequence.id} is paused\`);  
      return;  
    }  
      
    this.activeSequences.add(sequence.id);  
      
    try {  
      *// Evaluate sequence condition*  
      if (sequence.condition && \!await this.evaluateCondition(sequence.condition, context)) {  
        console.info(\`Condition not met for sequence ${sequence.id}\`);  
        return;  
      }  
        
      *// Set execution timeout*  
      const timeoutPromise \= new Promise((\_, reject) \=\>   
        setTimeout(() \=\> reject(new Error('Action sequence timeout')), sequence.timeoutMs)  
      );  
        
      *// Execute actions in sequence*  
      const executionPromise \= this.executeActionsInSequence(sequence.actions, context, sequence.stopOnError);  
        
      await Promise.race(\[executionPromise, timeoutPromise\]);  
        
      *// Log successful completion*  
      await this.auditLogger.log('action\_sequence\_completed', {  
        sequence\_id: sequence.id,  
        user\_id: context.userId,  
        execution\_time: Date.now() \- context.startTime,  
        actions\_count: sequence.actions.length  
      });  
        
    } catch (error) {  
      console.error(\`Action sequence ${sequence.id} failed:\`, error);  
        
      await this.auditLogger.log('action\_sequence\_failed', {  
        sequence\_id: sequence.id,  
        user\_id: context.userId,  
        error\_message: error.message,  
        execution\_time: Date.now() \- context.startTime  
      });  
        
      throw error;  
    } finally {  
      this.activeSequences.delete(sequence.id);  
    }  
  }  
    
  private async executeActionsInSequence(  
    actions: Action\[\],  
    context: ActionContext,  
    stopOnError: boolean  
  ): Promise\<void\> {  
    for (let i \= 0; i \< actions.length; i\++) {  
      const action \= actions\[i\];  
        
      try {  
        console.log(\`Executing action ${i \+ 1}/${actions.length}: ${action.type}\`);  
          
        *// Execute individual action*  
        await this.executeAction(action, context);  
          
        *// Handle action variables for subsequent actions*  
        if (action.outputVariable && action.result \!== undefined) {  
          context.actionVariables\[action.outputVariable\] \= action.result;  
        }  
          
        *// Special handling for stored procedures \- stop sequence on failure*  
        if (action.type \=== 'stored\_procedure' && action.failed) {  
          console.error(\`Stored procedure failed: ${action.id}. Stopping sequence.\`);  
          break;  
        }  
          
        *// Emit action completed event*  
        this.eventBus.emit('action:completed', {  
          actionId: action.id,  
          actionType: action.type,  
          result: action.result,  
          context  
        });  
          
      } catch (error) {  
        console.error(\`Action ${action.id} failed:\`, error);  
          
        *// Log individual action failure*  
        await this.auditLogger.log('action\_failed', {  
          action\_id: action.id,  
          action\_type: action.type,  
          user\_id: context.userId,  
          error\_message: error.message  
        });  
          
        *// Emit action failed event*  
        this.eventBus.emit('action:failed', {  
          actionId: action.id,  
          actionType: action.type,  
          error,  
          context  
        });  
          
        *// Stop sequence execution if configured to do so*  
        if (stopOnError) {  
          throw error;  
        }  
          
        *// Continue with next action*  
        console.warn(\`Continuing sequence despite action failure\`);  
      }  
    }  
  }  
}

### **Sequence Management Methods**

Control Flow Operations:

typescript  
*// Within ActionSequenceOrchestrator class*

pauseSequence(sequenceId: string): void {  
  this.pausedSequences.add(sequenceId);  
  this.eventBus.emit('sequence:paused', { sequenceId });  
}

resumeSequence(sequenceId: string): void {  
  this.pausedSequences.delete(sequenceId);  
  this.eventBus.emit('sequence:resumed', { sequenceId });  
}

pauseAllSequences(): void {  
  this.activeSequences.forEach(sequenceId \=\> {  
    this.pausedSequences.add(sequenceId);  
  });  
  this.eventBus.emit('sequences:all\_paused');  
}

resumeAllSequences(): void {  
  this.pausedSequences.clear();  
  this.eventBus.emit('sequences:all\_resumed');  
}  
---

## **4.2 Action Variables System**

Manages variables that flow between actions, including user selections, control values, AI results, and stored procedure outputs.

### **Core Interfaces**

ActionContext and UserSelection:

typescript  
interface ActionContext {  
  userId: string;  
  workbookId: string;  
  elementId: string;  
  startTime: number;  
  selection?: UserSelection;  
  actionVariables: Record\<string, any\>;  
  controls: Record\<string, any\>;  
  warehouse: WarehouseConnection;  
  metadata?: Record\<string, any\>;  
}

interface UserSelection {  
  rows: Record\<string, any\>\[\];  
  columns: string\[\];  
  elementType: string;  
  cellCoordinates?: { row: number; column: string };  
}

### **Variable Manager Implementation**

ActionVariableManager Class:

typescript  
class ActionVariableManager {  
  private formulaEngine: FormulaEngine;  
    
  constructor(formulaEngine: FormulaEngine) {  
    this.formulaEngine \= formulaEngine;  
  }  
    
  resolveVariable(reference: string, context: ActionContext): any {  
    *// Handle Selection variables: \[Selection/ColumnName\]*  
    if (reference.startsWith('\[Selection/')) {  
      const columnName \= reference.slice(11, \-1);  
      return this.resolveSelectionVariable(columnName, context.selection);  
    }  
      
    *// Handle Control variables: \[Control/ControlId\]*  
    if (reference.startsWith('\[Control/')) {  
      const controlId \= reference.slice(9, \-1);  
      return context.controls\[controlId\];  
    }  
      
    *// Handle Action variables: \[ActionVar/VariableName\]*  
    if (reference.startsWith('\[ActionVar/')) {  
      const varName \= reference.slice(11, \-1);  
      return context.actionVariables\[varName\];  
    }  
      
    *// Handle Element references: \[ElementName/ColumnName\]*  
    if (reference.startsWith('\[') && reference.includes('/') && reference.endsWith('\]')) {  
      const \[elementName, columnName\] \= reference.slice(1, \-1).split('/');  
      return this.resolveElementColumn(elementName, columnName, context);  
    }  
      
    *// Return as static value*  
    return reference;  
  }  
    
  private resolveSelectionVariable(columnName: string, selection?: UserSelection): any {  
    if (\!selection || \!selection.rows.length) {  
      return null;  
    }  
      
    *// Return array of values from selected rows*  
    const values \= selection.rows.map(row \=\> row\[columnName\]).filter(v \=\> v \!== null && v \!== undefined);  
      
    *// Return single value if only one row selected, otherwise array*  
    return values.length \=== 1 ? values\[0\] : values;  
  }  
    
  private async resolveElementColumn(elementName: string, columnName: string, context: ActionContext): Promise\<any\> {  
    *// Query the warehouse to get all values from the specified element/column*  
    const sql \= \`SELECT DISTINCT ${columnName} FROM ${elementName} WHERE ${columnName} IS NOT NULL\`;  
    const result \= await context.warehouse.execute(sql);  
    return result.rows.map(row \=\> row\[columnName\]);  
  }  
    
  async evaluateFormula(formula: string, context: ActionContext): Promise\<any\> {  
    *// Replace action variables with actual values*  
    let processedFormula \= formula;  
    const variablePattern \= /  
$$  
(\[^  
$$\]\+)\\\]/g;  
    const matches \= Array.from(formula.matchAll(variablePattern));  
      
    for (const match of matches) {  
      const variableReference \= match\[0\];  
      const resolvedValue \= await this.resolveVariable(variableReference, context);  
        
      *// Handle different data types for SQL/formula injection*  
      let replacementValue: string;  
      if (Array.isArray(resolvedValue)) {  
        replacementValue \= \`(${resolvedValue.map(v \=\> typeof v \=== 'string' ? \`'${v}'\` : String(v)).join(', ')})\`;  
      } else if (typeof resolvedValue \=== 'string') {  
        replacementValue \= \`'${resolvedValue.replace(/'/g, "''")}'\`;  
      } else if (resolvedValue \=== null || resolvedValue \=== undefined) {  
        replacementValue \= 'NULL';  
      } else {  
        replacementValue \= String(resolvedValue);  
      }  
        
      processedFormula \= processedFormula.replace(variableReference, replacementValue);  
    }  
      
    *// Execute formula using the formula engine*  
    return await this.formulaEngine.evaluate(processedFormula, context);  
  }  
}

### **Variable Management Utilities**

CRUD Operations for Action Variables:

typescript  
*// Within ActionVariableManager class*

setActionVariable(name: string, value: any, context: ActionContext): void {  
  context.actionVariables\[name\] \= value;  
}

getActionVariable(name: string, context: ActionContext): any {  
  return context.actionVariables\[name\];  
}

clearActionVariable(name: string, context: ActionContext): void {  
  delete context.actionVariables\[name\];  
}

listActionVariables(context: ActionContext): string\[\] {  
  return Object.keys(context.actionVariables);  
}

*// Advanced variable operations*  
copyVariablesFromContext(sourceContext: ActionContext, targetContext: ActionContext, variableNames?: string\[\]): void {  
  const namesToCopy \= variableNames || Object.keys(sourceContext.actionVariables);  
    
  for (const name of namesToCopy) {  
    if (sourceContext.actionVariables\[name\] \!== undefined) {  
      targetContext.actionVariables\[name\] \= sourceContext.actionVariables\[name\];  
    }  
  }  
}  
---

## **4.3 Individual Action Handlers**

Action handlers implement specific business logic for different action types. Each handler follows a consistent interface pattern.

### **Base Action Handler Interface**

ActionHandler Interface:

typescript  
interface ActionHandler {  
  execute(action: Action, context: ActionContext): Promise\<any\>;  
  preExecute?(action: Action, context: ActionContext): Promise\<void\>;  
  postExecute?(action: Action, context: ActionContext): Promise\<void\>;  
  validate?(action: Action): boolean;  
}

interface Action {  
  id: string;  
  type: string;  
  name?: string;  
  parameters: Record\<string, any\>;  
  outputVariable?: string;  
  result?: any;  
  failed?: boolean;  
  executionTime?: number;  
}

### **Input Table Action Handler**

Managing Data Operations:

typescript  
class InputTableActionHandler implements ActionHandler {  
  constructor(  
    private writeBackEngine: WriteBackEngine,  
    private variableManager: ActionVariableManager  
  ) {}  
    
  async execute(action: Action, context: ActionContext): Promise\<any\> {  
    switch (action.parameters.subtype) {  
      case 'insert\_row':  
        return await this.insertRow(action, context);  
      case 'update\_row':  
        return await this.updateRow(action, context);  
      case 'delete\_row':  
        return await this.deleteRow(action, context);  
      default:  
        throw new Error(\`Unsupported input table action: ${action.parameters.subtype}\`);  
    }  
  }  
    
  private async insertRow(action: Action, context: ActionContext): Promise\<string\> {  
    const { targetTable, columnValues } \= action.parameters;  
      
    *// Resolve all column values*  
    const resolvedValues: Record\<string, any\> \= {};  
    for (const \[columnName, valueConfig\] of Object.entries(columnValues)) {  
      resolvedValues\[columnName\] \= await this.resolveValue(valueConfig, context);  
    }  
      
    *// Insert row using write-back engine*  
    const rowId \= await this.writeBackEngine.insertRow(targetTable, resolvedValues, context.userId);  
      
    return rowId;  
  }  
    
  private async updateRow(action: Action, context: ActionContext): Promise\<void\> {  
    const { targetTable, rowIdentifier, columnValues } \= action.parameters;  
      
    *// Resolve row identifier*  
    const rowId \= await this.resolveValue(rowIdentifier, context);  
      
    *// Resolve column updates*  
    const resolvedValues: Record\<string, any\> \= {};  
    for (const \[columnName, valueConfig\] of Object.entries(columnValues)) {  
      resolvedValues\[columnName\] \= await this.resolveValue(valueConfig, context);  
    }  
      
    *// Update row*  
    await this.writeBackEngine.updateRow(targetTable, rowId, resolvedValues, context.userId);  
  }  
    
  private async deleteRow(action: Action, context: ActionContext): Promise\<void\> {  
    const { targetTable, rowIdentifier } \= action.parameters;  
      
    *// Resolve row identifier*  
    const rowId \= await this.resolveValue(rowIdentifier, context);  
      
    *// Delete row*  
    await this.writeBackEngine.deleteRow(targetTable, rowId);  
  }  
    
  private async resolveValue(valueConfig: any, context: ActionContext): Promise\<any\> {  
    switch (valueConfig.type) {  
      case 'static':  
        return valueConfig.value;  
      case 'column':  
        return this.variableManager.resolveVariable(\`\[Selection/${valueConfig.columnName}\]\`, context);  
      case 'control':  
        return context.controls\[valueConfig.controlId\];  
      case 'formula':  
        return await this.variableManager.evaluateFormula(valueConfig.formula, context);  
      default:  
        return valueConfig.value;  
    }  
  }  
}

### **Control Action Handler**

Managing UI Control State:

typescript  
class ControlActionHandler implements ActionHandler {  
  constructor(  
    private variableManager: ActionVariableManager,  
    private eventBus: EventBus  
  ) {}  
    
  async execute(action: Action, context: ActionContext): Promise\<any\> {  
    switch (action.parameters.subtype) {  
      case 'set\_value':  
        return await this.setControlValue(action, context);  
      case 'clear\_value':  
        return await this.clearControlValue(action, context);  
      case 'enable':  
        return await this.enableControl(action, context);  
      case 'disable':  
        return await this.disableControl(action, context);  
      default:  
        throw new Error(\`Unsupported control action: ${action.parameters.subtype}\`);  
    }  
  }  
    
  private async setControlValue(action: Action, context: ActionContext): Promise\<void\> {  
    const { targetControl, value, selectionMode \= 'replace' } \= action.parameters;  
      
    *// Resolve the value to set*  
    const resolvedValue \= await this.resolveControlValue(value, context);  
      
    *// Get current control value*  
    const currentValue \= context.controls\[targetControl\];  
      
    *// Apply selection mode logic*  
    let newValue: any;  
    switch (selectionMode) {  
      case 'replace':  
        newValue \= resolvedValue;  
        break;  
      case 'add':  
        newValue \= Array.isArray(currentValue)   
          ? \[...currentValue, ...this.ensureArray(resolvedValue)\]  
          : this.ensureArray(resolvedValue);  
        break;  
      case 'remove':  
        if (Array.isArray(currentValue)) {  
          const valuesToRemove \= this.ensureArray(resolvedValue);  
          newValue \= currentValue.filter(v \=\> \!valuesToRemove.includes(v));  
        } else {  
          newValue \= currentValue \=== resolvedValue ? null : currentValue;  
        }  
        break;  
    }  
      
    *// Update control value*  
    context.controls\[targetControl\] \= newValue;  
      
    *// Emit control change event*  
    this.eventBus.emit('control:changed', {  
      controlId: targetControl,  
      oldValue: currentValue,  
      newValue,  
      userId: context.userId  
    });  
  }  
    
  private async clearControlValue(action: Action, context: ActionContext): Promise\<void\> {  
    const { targetControl } \= action.parameters;  
    const currentValue \= context.controls\[targetControl\];  
      
    context.controls\[targetControl\] \= null;  
      
    this.eventBus.emit('control:cleared', {  
      controlId: targetControl,  
      previousValue: currentValue,  
      userId: context.userId  
    });  
  }  
    
  private ensureArray(value: any): any\[\] {  
    return Array.isArray(value) ? value : \[value\];  
  }  
    
  private async resolveControlValue(valueConfig: any, context: ActionContext): Promise\<any\> {  
    return await this.variableManager.resolveVariable(valueConfig, context);  
  }  
}

### **AI Query Action Handler**

Executing Warehouse-Native AI Operations:

typescript  
class AIQueryActionHandler implements ActionHandler {  
  constructor(  
    private variableManager: ActionVariableManager,  
    private aiProviderManager: AIProviderManager  
  ) {}  
    
  async execute(action: Action, context: ActionContext): Promise\<any\> {  
    const { model, query, parameters, errorHandling \= 'fail' } \= action.parameters;  
      
    try {  
      *// Resolve query parameters using variable manager*  
      const resolvedQuery \= await this.variableManager.evaluateFormula(query, context);  
      const resolvedParameters \= await this.resolveParameters(parameters, context);  
        
      *// Execute AI query through appropriate provider*  
      const result \= await this.aiProviderManager.executeQuery(model, resolvedQuery, resolvedParameters);  
        
      return result;  
        
    } catch (error) {  
      console.error(\`AI Query action failed:\`, error);  
        
      switch (errorHandling) {  
        case 'fail':  
          throw error;  
        case 'continue':  
          return null;  
        case 'retry':  
          *// Implement retry logic with exponential backoff*  
          return await this.retryWithBackoff(() \=\>   
            this.aiProviderManager.executeQuery(model, query, parameters), 3  
          );  
        default:  
          throw error;  
      }  
    }  
  }  
    
  private async resolveParameters(parameters: any, context: ActionContext): Promise\<any\> {  
    if (\!parameters) return {};  
      
    const resolved: any \= {};  
    for (const \[key, value\] of Object.entries(parameters)) {  
      resolved\[key\] \= await this.variableManager.resolveVariable(String(value), context);  
    }  
    return resolved;  
  }  
    
  private async retryWithBackoff\<T\>(fn: () \=\> Promise\<T\>, maxRetries: number): Promise\<T\> {  
    let lastError: Error;  
      
    for (let attempt \= 1; attempt \<= maxRetries; attempt\++) {  
      try {  
        return await fn();  
      } catch (error) {  
        lastError \= error as Error;  
          
        if (attempt \< maxRetries) {  
          const backoffMs \= Math.pow(2, attempt) \* 1000; *// Exponential backoff*  
          await new Promise(resolve \=\> setTimeout(resolve, backoffMs));  
        }  
      }  
    }  
      
    throw lastError\!;  
  }  
}

# **5\. User Interface Framework**

## **Overview and Objectives**

The User Interface Framework provides the foundation for creating Sigma-compatible layouts and interactions that deliver app-like experiences. This framework serves as both a design system specification and implementation guide, enabling full-stack developers to create professional-grade data applications that integrate seamlessly with Sigma's platform while maintaining full control over custom business logic and user experiences.

### **Core Framework Objectives**

1\. Design System Consistency

* Provide standardized, reusable UI components that match Sigma's design patterns  
* Ensure visual and behavioral consistency across all custom applications  
* Maintain compatibility with Sigma's existing UI elements and styling

2\. Complex Layout Management

* Implement sophisticated grid-based positioning systems with responsive capabilities  
* Support nested component hierarchies with proper spacing and alignment  
* Handle dynamic content sizing and cross-device compatibility

3\. Advanced User Interactions

* Connect UI components seamlessly to the Action System for event-driven workflows  
* Manage complex state synchronization between UI elements and warehouse data  
* Support real-time updates and cross-element communication patterns

4\. Production-Ready Components

* Deliver enterprise-grade components with built-in accessibility features  
* Include keyboard navigation, focus management, and ARIA compliance  
* Handle error states, loading states, and edge cases gracefully

5\. Developer Productivity

* Offer comprehensive TypeScript interfaces for type safety and enhanced development experience  
* Provide clear component APIs with extensive configuration options  
* Include responsive utilities, helper functions, and debugging tools

The framework emphasizes responsive design, cross-element communication, and sophisticated state management to ensure that custom applications provide the same high-quality user experience as native Sigma functionality.

---

## **5.1 Component Architecture**

### **Base Element System**

Every UI component in a Sigma-compatible application extends from a common base element system that provides consistent positioning, styling, and interaction capabilities.

Core Element Interface:

typescript  
interface SigmaElement {  
  id: string;  
  type: string;  
  position: GridPosition;  
  size: GridSize;  
  styling: ElementStyling;  
  actions?: ActionSequence\[\];  
  isVisible: boolean;  
  isInteractive: boolean;  
}

interface GridPosition {  
  x: number;  
  y: number;  
  gridColumn: string; *// CSS Grid column span (e.g., "1 / 3")*  
  gridRow: string; *// CSS Grid row span (e.g., "2 / 4")*  
}

interface GridSize {  
  width: number; *// Grid units (1-6, 1-12, or 1-24 depending on density)*  
  height: number; *// Grid units*  
  minWidth?: number;  
  minHeight?: number;  
  maxWidth?: number;  
  maxHeight?: number;  
}

interface ElementStyling {  
  backgroundColor?: string;  
  border?: BorderConfig;  
  padding?: number;  
  margin?: number;  
  borderRadius?: number;  
  boxShadow?: string;  
  zIndex?: number;  
}

### **Universal Element Wrapper**

The SigmaElementWrapper component serves as the foundation for all UI elements, handling interaction events, selection states, and action orchestration.

Implementation:

typescript  
const SigmaElementWrapper: React.FC\<{  
  element: SigmaElement;  
  children: React.ReactNode;  
  onAction?: (action: ActionSequence, context: ActionContext) \=\> void;  
  onSelection?: (selection: any) \=\> void;  
}\> \= ({ element, children, onAction, onSelection }) \=\> {  
  const \[isSelected, setIsSelected\] \= useState(false);  
  const \[isHovered, setIsHovered\] \= useState(false);  
    
  const handleInteraction \= useCallback((event: React.MouseEvent, interactionType: string) \=\> {  
    if (\!element.isInteractive) return;  
      
    *// Find actions matching this interaction type*  
    const matchingActions \= element.actions?.filter(action \=\>   
      action.trigger.type \=== interactionType  
    ) || \[\];  
      
    if (matchingActions.length \> 0) {  
      const context: ActionContext \= {  
        userId: getCurrentUserId(),  
        workbookId: getCurrentWorkbookId(),  
        elementId: element.id,  
        startTime: Date.now(),  
        selection: getElementSelection(element),  
        actionVariables: {},  
        controls: getCurrentControlValues(),  
        warehouse: getWarehouseConnection()  
      };  
        
      matchingActions.forEach(action \=\> onAction?.(action, context));  
    }  
      
    *// Handle selection changes*  
    if (interactionType \=== 'select') {  
      const selection \= extractSelectionFromEvent(event, element);  
      onSelection?.(selection);  
    }  
  }, \[element, onAction, onSelection\]);  
    
  const elementClasses \= \[  
    'sigma-element',  
    \`sigma-element-${element.type}\`,  
    isSelected ? 'selected' : '',  
    isHovered ? 'hovered' : '',  
    \!element.isVisible ? 'hidden' : '',  
    \!element.isInteractive ? 'non-interactive' : ''  
  \].filter(Boolean).join(' ');  
    
  return (  
    \<div   
      className\={elementClasses}  
      style\={{  
        gridColumn: element.position.gridColumn,  
        gridRow: element.position.gridRow,  
        ...element.styling,  
        display: element.isVisible ? 'block' : 'none'  
      }}  
      onClick\={(e) \=\> handleInteraction(e, 'click')}  
      onMouseEnter\={() \=\> setIsHovered(true)}  
      onMouseLeave\={() \=\> setIsHovered(false)}  
      data\-element\-id\={element.id}  
      data\-element\-type\={element.type}  
    \>  
      {children}  
    \</div\>  
  );  
};

### **Grid System Implementation**

The grid system provides the foundation for responsive, organized layouts that work consistently across different screen sizes and container types.

Grid Container Component:

typescript  
interface GridContainerProps {  
  density: 6 | 12 | 24;  
  spacing: 'small' | 'medium' | 'large';  
  padding: boolean;  
  children: React.ReactNode;  
  className?: string;  
}

const SigmaGridContainer: React.FC\<GridContainerProps\> \= ({   
  density \= 12,   
  spacing \= 'medium',   
  padding \= true,  
  children,  
  className \= ''  
}) \=\> {  
  const spacingValues \= {  
    small: '8px',  
    medium: '16px',  
    large: '24px'  
  };  
    
  const gridStyle \= {  
    display: 'grid',  
    gridTemplateColumns: \`repeat(${density}, 1fr)\`,  
    gap: spacingValues\[spacing\],  
    padding: padding ? spacingValues\[spacing\] : '0',  
    minHeight: '100%',  
    width: '100%'  
  };  
    
  return (  
    \<div   
      className\={\`sigma-grid-container grid-${density} spacing-${spacing} ${className}\`}  
      style\={gridStyle}  
    \>  
      {children}  
    \</div\>  
  );  
};

Responsive Grid Hook:

typescript  
const useResponsiveGrid \= (baseColumns: number) \=\> {  
  const \[columns, setColumns\] \= useState(baseColumns);  
    
  useEffect(() \=\> {  
    const handleResize \= () \=\> {  
      const width \= window.innerWidth;  
      if (width \< 768) {  
        setColumns(6); *// Mobile: 6 columns*  
      } else if (width \< 1024) {  
        setColumns(12); *// Tablet: 12 columns*    
      } else {  
        setColumns(baseColumns); *// Desktop: original columns*  
      }  
    };  
      
    handleResize();  
    window.addEventListener('resize', handleResize);  
    return () \=\> window.removeEventListener('resize', handleResize);  
  }, \[baseColumns\]);  
    
  return columns;  
};  
---

## **5.2 Layout Elements**

### **Container Component**

Containers provide structured layout organization with sophisticated nesting controls and responsive behavior.

Container Interface and Implementation:

typescript  
interface ContainerProps {  
  id: string;  
  gridDensity: 6 | 12 | 24;  
  spacing: 'small' | 'medium' | 'large';  
  padding: boolean;  
  backgroundColor?: string;  
  border?: BorderConfig;  
  cornerStyle: 'square' | 'round' | 'pill';  
  elementGap: boolean;  
  children: React.ReactNode;  
  maxNestingLevel?: number;  
}

const SigmaContainer: React.FC\<ContainerProps\> \= ({   
  id,  
  gridDensity \= 12,   
  spacing \= 'medium',   
  padding \= true,  
  backgroundColor,  
  border,  
  cornerStyle \= 'round',  
  elementGap \= true,  
  children,  
  maxNestingLevel \= 4  
}) \=\> {  
  const \[nestingLevel, setNestingLevel\] \= useState(0);  
  const containerRef \= useRef\<HTMLDivElement\>(null);  
    
  *// Check nesting level to prevent infinite nesting*  
  useEffect(() \=\> {  
    let level \= 0;  
    let parent \= containerRef.current?.parentElement;  
      
    while (parent && level \< maxNestingLevel) {  
      if (parent.classList.contains('sigma-container')) {  
        level\++;  
      }  
      parent \= parent.parentElement;  
    }  
      
    setNestingLevel(level);  
      
    if (level \>= maxNestingLevel) {  
      console.warn(\`Container ${id} exceeds maximum nesting level of ${maxNestingLevel}\`);  
    }  
  }, \[id, maxNestingLevel\]);  
    
  const containerStyles \= {  
    backgroundColor,  
    border: border ? \`${border.width}px solid ${border.color}\` : 'none',  
    borderRadius: cornerStyle \=== 'square' ? '0' :   
                 cornerStyle \=== 'pill' ? '9999px' : '8px',  
    ...getSpacingStyles(spacing, padding, elementGap)  
  };  
    
  return (  
    \<div   
      ref\={containerRef}  
      className\={\`sigma-container nesting-level-${nestingLevel}\`}  
      data\-container\-id\={id}  
      style\={containerStyles}  
    \>  
      \<SigmaGridContainer   
        density\={gridDensity}   
        spacing\={spacing}   
        padding\={false} *// Padding handled by container*  
      \>  
        {children}  
      \</SigmaGridContainer\>  
    \</div\>  
  );  
};

const getSpacingStyles \= (spacing: string, padding: boolean, elementGap: boolean) \=\> {  
  const spacingValues \= {  
    small: '8px',  
    medium: '16px',   
    large: '24px'  
  };  
    
  return {  
    padding: padding ? spacingValues\[spacing\] : '0',  
    gap: elementGap ? spacingValues\[spacing\] : '0'  
  };  
};

### **Modal Component**

Modals provide focused interaction experiences with sophisticated state management and accessibility features.

Modal Interface and Implementation:

typescript  
interface ModalProps {  
  id: string;  
  isOpen: boolean;  
  title: string;  
  width: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  
  showHeader: boolean;  
  showFooter: boolean;  
  showCloseIcon: boolean;  
  primaryButton?: ButtonConfig;  
  secondaryButton?: ButtonConfig;  
  preventCloseOnOverlay?: boolean;  
  onPrimaryAction?: () \=\> Promise\<void\>;  
  onSecondaryAction?: () \=\> Promise\<void\>;  
  onClose?: () \=\> void;  
  children: React.ReactNode;  
}

interface ButtonConfig {  
  text: string;  
  variant: 'primary' | 'secondary';  
  disabled?: boolean;  
  loading?: boolean;  
}

const SigmaModal: React.FC\<ModalProps\> \= ({   
  id,  
  isOpen,   
  title,   
  width \= 'md',   
  showHeader \= true,  
  showFooter \= true,  
  showCloseIcon \= true,  
  primaryButton,  
  secondaryButton,  
  preventCloseOnOverlay \= false,  
  onPrimaryAction,   
  onSecondaryAction,  
  onClose,  
  children   
}) \=\> {  
  const \[isLoading, setIsLoading\] \= useState(false);  
  const modalRef \= useRef\<HTMLDivElement\>(null);  
    
  *// Handle ESC key press*  
  useEffect(() \=\> {  
    if (\!isOpen) return;  
      
    const handleEscKey \= (event: KeyboardEvent) \=\> {  
      if (event.key \=== 'Escape' && \!preventCloseOnOverlay) {  
        onClose?.();  
      }  
    };  
      
    document.addEventListener('keydown', handleEscKey);  
    return () \=\> document.removeEventListener('keydown', handleEscKey);  
  }, \[isOpen, onClose, preventCloseOnOverlay\]);  
    
  *// Focus management for accessibility*  
  useEffect(() \=\> {  
    if (isOpen && modalRef.current) {  
      const focusableElements \= modalRef.current.querySelectorAll(  
        'button, \[href\], input, select, textarea, \[tabindex\]:not(\[tabindex="-1"\])'  
      );  
      const firstElement \= focusableElements\[0\] as HTMLElement;  
      firstElement?.focus();  
    }  
  }, \[isOpen\]);  
    
  const handleOverlayClick \= (event: React.MouseEvent) \=\> {  
    if (event.target \=== event.currentTarget && \!preventCloseOnOverlay) {  
      onClose?.();  
    }  
  };  
    
  const handlePrimaryClick \= async () \=\> {  
    if (onPrimaryAction && \!isLoading) {  
      setIsLoading(true);  
      try {  
        await onPrimaryAction();  
      } finally {  
        setIsLoading(false);  
      }  
    }  
  };  
    
  const widthClasses \= {  
    xs: 'max-w-sm',   *// \~384px*  
    sm: 'max-w-md',   *// \~448px*    
    md: 'max-w-lg',   *// \~512px*  
    lg: 'max-w-2xl',  *// \~672px*  
    xl: 'max-w-4xl'   *// \~896px*  
  };  
    
  if (\!isOpen) return null;  
    
  return (  
    \<div   
      className\="sigma-modal-overlay"  
      onClick\={handleOverlayClick}  
      style\={{  
        position: 'fixed',  
        top: 0,  
        left: 0,  
        right: 0,  
        bottom: 0,  
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  
        display: 'flex',  
        alignItems: 'center',  
        justifyContent: 'center',  
        zIndex: 1000  
      }}  
    \>  
      \<div   
        ref\={modalRef}  
        className\={\`sigma-modal ${widthClasses\[width\]}\`}  
        data\-modal\-id\={id}  
        style\={{  
          backgroundColor: 'white',  
          borderRadius: '8px',  
          boxShadow: '0 25px 50px \-12px rgba(0, 0, 0, 0.25)',  
          maxHeight: '90vh',  
          overflow: 'hidden',  
          display: 'flex',  
          flexDirection: 'column'  
        }}  
        onClick\={(e) \=\> e.stopPropagation()}  
      \>  
        {showHeader && (  
          \<header className\="sigma-modal-header" style\={{  
            padding: '16px 24px',  
            borderBottom: '1px solid \#e5e7eb',  
            display: 'flex',  
            alignItems: 'center',  
            justifyContent: 'space-between'  
          }}\>  
            \<h2 style\={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}\>  
              {title}  
            \</h2\>  
            {showCloseIcon && (  
              \<button   
                onClick\={onClose}  
                className\="sigma-modal-close"  
                style\={{  
                  background: 'none',  
                  border: 'none',  
                  fontSize: '1.5rem',  
                  cursor: 'pointer',  
                  padding: '4px',  
                  lineHeight: 1  
                }}  
                aria\-label\="Close modal"  
              \>  
                ×  
              \</button\>  
            )}  
          \</header\>  
        )}  
          
        \<main className\="sigma-modal-content" style\={{  
          flex: 1,  
          overflow: 'auto',  
          padding: '24px'  
        }}\>  
          {children}  
        \</main\>  
          
        {showFooter && (primaryButton || secondaryButton) && (  
          \<footer className\="sigma-modal-footer" style\={{  
            padding: '16px 24px',  
            borderTop: '1px solid \#e5e7eb',  
            display: 'flex',  
            justifyContent: 'flex-end',  
            gap: '12px'  
          }}\>  
            {secondaryButton && (  
              \<button   
                onClick\={onSecondaryAction}  
                className\="sigma-button secondary"  
                disabled\={isLoading}  
                style\={{  
                  padding: '8px 16px',  
                  borderRadius: '6px',  
                  border: '1px solid \#d1d5db',  
                  backgroundColor: 'white',  
                  cursor: 'pointer'  
                }}  
              \>  
                {secondaryButton.text}  
              \</button\>  
            )}  
            {primaryButton && (  
              \<button   
                onClick\={handlePrimaryClick}  
                className\="sigma-button primary"  
                disabled\={isLoading || primaryButton.disabled}  
                style\={{  
                  padding: '8px 16px',  
                  borderRadius: '6px',  
                  border: 'none',  
                  backgroundColor: '\#3b82f6',  
                  color: 'white',  
                  cursor: isLoading ? 'wait' : 'pointer',  
                  opacity: (isLoading || primaryButton.disabled) ? 0.6 : 1  
                }}  
              \>  
                {isLoading ? 'Loading...' : primaryButton.text}  
              \</button\>  
            )}  
          \</footer\>  
        )}  
      \</div\>  
    \</div\>  
  );  
};

### **Tabbed Container Component**

Tabbed containers organize related content into navigable sections with comprehensive styling and interaction options.

Tabbed Container Implementation:

typescript  
interface TabbedContainerProps {  
  id: string;  
  tabs: Tab\[\];  
  defaultTab: string;  
  showTabBar: boolean;  
  tabStyle: 'open' | 'box' | 'button';  
  alignment: 'left' | 'center' | 'end' | 'justify';  
  size: 'small' | 'medium' | 'large';  
  onTabChange?: (tabId: string) \=\> void;  
}

interface Tab {  
  id: string;  
  label: string;  
  disabled?: boolean;  
  children: React.ReactNode;  
}

const SigmaTabbedContainer: React.FC\<TabbedContainerProps\> \= ({  
  id,  
  tabs,  
  defaultTab,  
  showTabBar \= true,  
  tabStyle \= 'open',  
  alignment \= 'left',  
  size \= 'medium',  
  onTabChange  
}) \=\> {  
  const \[activeTab, setActiveTab\] \= useState(defaultTab || tabs\[0\]?.id);  
    
  const handleTabClick \= (tabId: string) \=\> {  
    if (tabs.find(t \=\> t.id \=== tabId)?.disabled) return;  
      
    setActiveTab(tabId);  
    onTabChange?.(tabId);  
  };  
    
  const activeTabContent \= tabs.find(tab \=\> tab.id \=== activeTab);  
    
  const tabBarStyles \= {  
    left: 'justify-start',  
    center: 'justify-center',   
    end: 'justify-end',  
    justify: 'justify-between'  
  };  
    
  const sizeStyles \= {  
    small: { padding: '6px 12px', fontSize: '0.875rem' },  
    medium: { padding: '8px 16px', fontSize: '1rem' },  
    large: { padding: '12px 20px', fontSize: '1.125rem' }  
  };  
    
  return (  
    \<div className\="sigma-tabbed-container" data\-container\-id\={id}\>  
      {showTabBar && (  
        \<div   
          className\={\`sigma\-tab

# **6\. AI Integration Capabilities**

## **Overview and Objectives**

AI Integration transforms Sigma-compatible applications from traditional data tools into intelligent automation platforms. This section provides comprehensive guidance for full-stack developers to implement warehouse-native AI processing, multi-modal capabilities, intelligent workflows, and enterprise AI governance within their custom applications.

### **Core AI Integration Goals**

1\. Warehouse-Native Processing

* Leverage cloud data warehouse AI functions (Snowflake Cortex, Databricks AI, BigQuery ML, Redshift ML)  
* Maintain single source of compute for both data processing and AI operations  
* Ensure consistent security, governance, and cost management across all operations

2\. Multi-Modal AI Capabilities

* Support text, image, document, and audio processing within unified workflows  
* Enable complex AI pipelines that combine multiple models and data types  
* Provide seamless integration between different AI function types

3\. Intelligent Workflow Automation

* Create event-driven AI workflows that respond to data changes and user interactions  
* Implement conditional AI processing based on business rules and thresholds  
* Support complex multi-step AI operations with error handling and recovery

4\. Enterprise AI Governance

* Implement comprehensive cost tracking, usage monitoring, and budget controls  
* Ensure compliance with data privacy, model access, and regulatory requirements  
* Provide audit trails and performance analytics for all AI operations

---

## **6.1 Warehouse-Native AI Engine**

The Universal AI Engine provides a consistent interface across different cloud data warehouses while leveraging each platform's native AI capabilities for optimal performance and cost efficiency.

### **Core AI Interfaces**

Universal AI Query Interface:

typescript  
interface AIQueryEngine {  
  executeAIQuery(query: AIQuery, context: ActionContext): Promise\<AIResult\>;  
  estimateTokens(query: AIQuery): Promise\<number\>;  
  validateModelAccess(userId: string, modelId: string): Promise\<boolean\>;  
  trackUsage(query: AIQuery, result: AIResult, context: ActionContext): Promise\<void\>;  
}

interface AIQuery {  
  warehouse: 'snowflake' | 'databricks' | 'bigquery' | 'redshift';  
  function: string;  
  model?: string;  
  prompt: string | MultiModalInput;  
  parameters?: AIParameters;  
  outputVariable: string;  
  costBudget?: number;  
}

interface AIParameters {  
  max\_tokens?: number;  
  temperature?: number;  
  top\_p?: number;  
  categories?: string\[\];  
  targetLanguage?: string;  
  mode?: string;  
  \[key: string\]: any;  
}

interface AIResult {  
  result: any;  
  tokensUsed?: number;  
  confidence?: number;  
  model?: string;  
  executionTime?: number;  
  cost?: number;  
  metadata?: Record\<string, any\>;  
}

### **Universal AI Engine Implementation**

Core Engine Architecture:

typescript  
class UniversalAIEngine implements AIQueryEngine {  
  constructor(  
    private warehouseConnections: Map\<string, WarehouseConnection\>,  
    private aiGovernance: AIGovernanceEngine,  
    private auditLogger: AuditLogger  
  ) {}  
    
  async executeAIQuery(query: AIQuery, context: ActionContext): Promise\<AIResult\> {  
    *// 1\. Validate model access and governance policies*  
    await this.aiGovernance.validateQuery(query, context);  
      
    *// 2\. Estimate and check cost constraints*  
    const estimatedTokens \= await this.estimateTokens(query);  
    const estimatedCost \= await this.aiGovernance.estimateCost(query.model || '', estimatedTokens);  
      
    if (query.costBudget && estimatedCost \> query.costBudget) {  
      throw new AIBudgetExceededError(\`Estimated cost ${estimatedCost} exceeds budget ${query.costBudget}\`);  
    }  
      
    *// 3\. Execute warehouse-specific AI operation*  
    const connection \= this.warehouseConnections.get(query.warehouse);  
    if (\!connection) {  
      throw new Error(\`No connection available for warehouse: ${query.warehouse}\`);  
    }  
      
    let result: AIResult;  
    const startTime \= Date.now();  
      
    try {  
      switch (query.warehouse) {  
        case 'snowflake':  
          result \= await this.executeSnowflakeAI(query, connection, context);  
          break;  
        case 'databricks':  
          result \= await this.executeDatabricksAI(query, connection, context);  
          break;  
        case 'bigquery':  
          result \= await this.executeBigQueryML(query, connection, context);  
          break;  
        case 'redshift':  
          result \= await this.executeRedshiftML(query, connection, context);  
          break;  
        default:  
          throw new Error(\`Unsupported warehouse: ${query.warehouse}\`);  
      }  
        
      result.executionTime \= Date.now() \- startTime;  
        
      *// 4\. Store result as action variable for subsequent operations*  
      context.actionVariables\[query.outputVariable\] \= result.result;  
        
      *// 5\. Track usage, costs, and performance metrics*  
      await this.trackUsage(query, result, context);  
        
      return result;  
        
    } catch (error) {  
      *// Comprehensive error logging for debugging and monitoring*  
      await this.auditLogger.log('ai\_query\_failed', {  
        query\_id: \`${context.userId}\_${Date.now()}\`,  
        warehouse: query.warehouse,  
        function: query.function,  
        model: query.model,  
        user\_id: context.userId,  
        error\_message: error.message,  
        execution\_time: Date.now() \- startTime  
      });  
        
      throw error;  
    }  
  }  
}

### **Snowflake Cortex Integration**

Snowflake AI Function Implementation:

typescript  
*// Within UniversalAIEngine class*  
private async executeSnowflakeAI(query: AIQuery, connection: WarehouseConnection, context: ActionContext): Promise\<AIResult\> {  
  let sql: string;  
  const escapedPrompt \= this.escapePrompt(query.prompt);  
    
  switch (query.function) {  
    case 'AI\_COMPLETE':  
      sql \= \`SELECT AI\_COMPLETE('${query.model}', '${escapedPrompt}'\`;  
      if (query.parameters?.max\_tokens) {  
        sql \+= \`, modelParameters \=\> named\_struct('max\_tokens', ${query.parameters.max\_tokens}\`;  
        if (query.parameters.temperature) {  
          sql \+= \`, 'temperature', ${query.parameters.temperature}\`;  
        }  
        sql \+= ')';  
      }  
      sql \+= ') as result';  
      break;  
        
    case 'AI\_CLASSIFY':  
      const categories \= query.parameters?.categories?.map(c \=\> \`'${c}'\`).join(',') || '';  
      sql \= \`SELECT AI\_CLASSIFY('${escapedPrompt}', ARRAY(${categories})) as result\`;  
      break;  
        
    case 'AI\_SENTIMENT':  
      sql \= \`SELECT AI\_SENTIMENT('${escapedPrompt}') as result\`;  
      break;  
        
    case 'AI\_SUMMARIZE':  
      sql \= \`SELECT SUMMARIZE('${escapedPrompt}') as result\`;  
      break;  
        
    case 'AI\_TRANSLATE':  
      const targetLang \= query.parameters?.targetLanguage || 'en';  
      sql \= \`SELECT TRANSLATE('${escapedPrompt}', '', '${targetLang}') as result\`;  
      break;  
        
    case 'AI\_EMBED':  
      sql \= \`SELECT AI\_EMBED('${escapedPrompt}') as result\`;  
      break;  
        
    case 'PARSE\_DOCUMENT':  
      const mode \= query.parameters?.mode || 'TEXT';  
      sql \= \`SELECT PARSE\_DOCUMENT('${escapedPrompt}', '${mode}') as result\`;  
      break;  
        
    case 'AI\_TRANSCRIBE':  
      sql \= \`SELECT AI\_TRANSCRIBE('${escapedPrompt}') as result\`;  
      break;  
        
    default:  
      throw new Error(\`Unsupported Snowflake AI function: ${query.function}\`);  
  }  
    
  const queryResult \= await connection.execute(sql);  
    
  return {  
    result: queryResult.rows\[0\]?.result,  
    tokensUsed: queryResult.metadata?.tokensUsed,  
    model: query.model,  
    cost: queryResult.metadata?.cost  
  };  
}

### **Databricks AI Integration**

Databricks AI Function Implementation:

typescript  
*// Within UniversalAIEngine class*  
private async executeDatabricksAI(query: AIQuery, connection: WarehouseConnection, context: ActionContext): Promise\<AIResult\> {  
  let sql: string;  
  const escapedPrompt \= this.escapePrompt(query.prompt);  
    
  switch (query.function) {  
    case 'ai\_query':  
      sql \= \`SELECT ai\_query('${query.model}', '${escapedPrompt}'\`;  
      if (query.parameters) {  
        const params \= Object.entries(query.parameters)  
          .map((\[k, v\]) \=\> \`'${k}', ${typeof v \=== 'string' ? \`'${v}'\` : v}\`)  
          .join(', ');  
        sql \+= \`, modelParameters \=\> named\_struct(${params})\`;  
      }  
      sql \+= ') as result';  
      break;  
        
    case 'ai\_classify':  
      const labels \= query.parameters?.categories?.map(c \=\> \`'${c}'\`).join(',') || '';  
      sql \= \`SELECT ai\_classify('${escapedPrompt}', ARRAY(${labels})) as result\`;  
      break;  
        
    case 'ai\_extract':  
      const entities \= query.parameters?.entities?.map(e \=\> \`'${e}'\`).join(',') || '';  
      sql \= \`SELECT ai\_extract('${escapedPrompt}', ARRAY(${entities})) as result\`;  
      break;  
        
    case 'ai\_summarize':  
      sql \= \`SELECT ai\_summarize('${escapedPrompt}') as result\`;  
      break;  
        
    case 'ai\_translate':  
      const targetLang \= query.parameters?.targetLanguage || 'en';  
      sql \= \`SELECT ai\_translate('${escapedPrompt}', '${targetLang}') as result\`;  
      break;  
        
    case 'ai\_analyze\_sentiment':  
      sql \= \`SELECT ai\_analyze\_sentiment('${escapedPrompt}') as result\`;  
      break;  
        
    case 'ai\_fix\_grammar':  
      sql \= \`SELECT ai\_fix\_grammar('${escapedPrompt}') as result\`;  
      break;  
        
    case 'ai\_mask':  
      const entities\_to\_mask \= query.parameters?.entities?.map(e \=\> \`'${e}'\`).join(',') || '';  
      sql \= \`SELECT ai\_mask('${escapedPrompt}', ARRAY(${entities\_to\_mask})) as result\`;  
      break;  
        
    default:  
      throw new Error(\`Unsupported Databricks AI function: ${query.function}\`);  
  }  
    
  const queryResult \= await connection.execute(sql);  
    
  return {  
    result: queryResult.rows\[0\]?.result,  
    model: query.model  
  };  
}

### **Utility Methods and Error Handling**

Security and Performance Utilities:

typescript  
*// Within UniversalAIEngine class*

private escapePrompt(prompt: string | MultiModalInput): string {  
  if (typeof prompt \=== 'string') {  
    *// Escape SQL injection and special characters*  
    return prompt.replace(/'/g, "''").replace(/\\\\/g, '\\\\\\\\');  
  }  
  *// Handle multi-modal inputs (images, documents, audio, etc.)*  
  return JSON.stringify(prompt).replace(/'/g, "''");  
}

async estimateTokens(query: AIQuery): Promise\<number\> {  
  const promptLength \= typeof query.prompt \=== 'string' ? query.prompt.length : 1000;  
  *// Rough estimation: \~4 characters per token for English text*  
  *// This could be enhanced with more sophisticated tokenization*  
  return Math.ceil(promptLength / 4);  
}

async validateModelAccess(userId: string, modelId: string): Promise\<boolean\> {  
  *// Implement user-based model access control*  
  return await this.aiGovernance.checkModelAccess(userId, modelId);  
}

async trackUsage(query: AIQuery, result: AIResult, context: ActionContext): Promise\<void\> {  
  *// Comprehensive usage tracking for billing, monitoring, and optimization*  
  await this.auditLogger.log('ai\_query\_executed', {  
    query\_id: \`${context.userId}\_${Date.now()}\`,  
    warehouse: query.warehouse,  
    function: query.function,  
    model: query.model,  
    user\_id: context.userId,  
    tokens\_used: result.tokensUsed || 0,  
    cost: result.cost || 0,  
    execution\_time: result.executionTime,  
    success: true,  
    timestamp: new Date(),  
    prompt\_length: typeof query.prompt \=== 'string' ? query.prompt.length : 0  
  });  
}

### **Multi-Modal Input Support**

Multi-Modal Data Structures:

typescript  
interface MultiModalInput {  
  type: 'multimodal';  
  content: MultiModalContent\[\];  
}

interface MultiModalContent {  
  type: 'text' | 'image' | 'document' | 'audio' | 'video';  
  data: string | Buffer; *// Base64 encoded or raw data*  
  metadata?: {  
    filename?: string;  
    mimeType?: string;  
    size?: number;  
    dimensions?: { width: number; height: number };  
    duration?: number; *// For audio/video*  
  };  
}

*// Example usage in AI queries*  
const multiModalQuery: AIQuery \= {  
  warehouse: 'snowflake',  
  function: 'AI\_COMPLETE',  
  model: 'gpt-4-vision',  
  prompt: {  
    type: 'multimodal',  
    content: \[  
      {  
        type: 'text',  
        data: 'Analyze this financial chart and provide insights:'  
      },  
      {  
        type: 'image',  
        data: base64ImageData,  
        metadata: {  
          filename: 'revenue\_chart.png',  
          mimeType: 'image/png'  
        }  
      }  
    \]  
  },  
  parameters: {  
    max\_tokens: 500,  
    temperature: 0.1  
  },  
  outputVariable: 'chart\_analysis'  
};

# **6.2 Multi-Modal AI Processing**

## **Overview and Capabilities**

Multi-Modal AI Processing extends the basic AI capabilities to handle complex, real-world data types including documents, images, audio, and mixed-content workflows. This section provides full-stack developers with the tools to build sophisticated AI-powered document processing, image analysis, and content extraction systems that integrate seamlessly with warehouse-native operations.

### **What This Section Adds**

1\. Advanced Document Intelligence

* Automated processing of PDFs, images, and text documents with content extraction  
* Document classification and type detection for workflow automation  
* Entity extraction tailored to specific document types (invoices, contracts, reports)  
* Structured data parsing from unstructured document content

2\. Image Analysis and Computer Vision

* Chart and graph analysis with data extraction capabilities  
* Text recognition and extraction from images (OCR functionality)  
* Image classification and content description for business workflows  
* Multi-modal input processing combining text and visual data

3\. Intelligent Content Processing

* Context-aware entity extraction based on document classification  
* Automated summarization and key information extraction  
* Confidence scoring and quality assessment for processing results  
* Integration with existing Action System workflows

4\. Production-Ready Pipeline Architecture

* Error handling and fallback processing for failed operations  
* Performance monitoring and processing time tracking  
* Scalable processing architecture for high-volume document workflows  
* Comprehensive audit logging for compliance and debugging

---

## **Document Processing Pipeline**

The document processing pipeline provides comprehensive capabilities for extracting, analyzing, and structuring information from various document formats.

### **Core Interfaces**

Document Processing Data Structures:

typescript  
interface DocumentProcessingResult {  
  documentType: string;  
  extractedText: string;  
  structuredData?: Record\<string, any\>;  
  entities?: EntityExtractionResult\[\];  
  confidence: number;  
  processingTime: number;  
}

interface EntityExtractionResult {  
  type: string;  
  value: string;  
  confidence: number;  
  position?: { start: number; end: number };  
}

interface ImageProcessingResult {  
  analysisType: string;  
  result: string;  
  structuredData?: Record\<string, any\>;  
  confidence: number;  
  processingTime: number;  
}

### **Multi-Modal Processor Implementation**

Comprehensive Document Processing:

typescript  
class MultiModalAIProcessor {  
  constructor(private aiEngine: AIQueryEngine) {}  
    
  async processDocument(  
    documentBuffer: Buffer,  
    documentType: 'pdf' | 'image' | 'text',  
    analysisType: 'extraction' | 'classification' | 'summarization' | 'entity\_extraction',  
    context: ActionContext  
  ): Promise\<DocumentProcessingResult\> {  
      
    const startTime \= Date.now();  
      
    *// Step 1: Parse document content based on type*  
    let extractedContent: string;  
      
    if (documentType \=== 'pdf' || documentType \=== 'image') {  
      const parseResult \= await this.aiEngine.executeAIQuery({  
        warehouse: 'snowflake',  
        function: 'PARSE\_DOCUMENT',  
        prompt: documentBuffer.toString('base64'),  
        parameters: { mode: 'LAYOUT' }, *// Preserves document structure*  
        outputVariable: 'parsed\_document'  
      }, context);  
        
      extractedContent \= parseResult.result;  
    } else {  
      extractedContent \= documentBuffer.toString('utf-8');  
    }  
      
    *// Step 2: Perform requested analysis based on type*  
    let analysisResult: AIResult;  
    let documentClassification \= 'unknown';  
      
    switch (analysisType) {  
      case 'classification':  
        analysisResult \= await this.aiEngine.executeAIQuery({  
          warehouse: 'snowflake',  
          function: 'AI\_CLASSIFY',  
          prompt: extractedContent,  
          parameters: {   
            categories: \['invoice', 'contract', 'report', 'correspondence', 'form', 'legal', 'technical'\]   
          },  
          outputVariable: 'document\_classification'  
        }, context);  
        documentClassification \= analysisResult.result;  
        break;  
          
      case 'entity\_extraction':  
        *// First classify document to determine appropriate entity types*  
        const classificationResult \= await this.aiEngine.executeAIQuery({  
          warehouse: 'snowflake',  
          function: 'AI\_CLASSIFY',  
          prompt: extractedContent,  
          parameters: { categories: \['invoice', 'contract', 'report', 'correspondence'\] },  
          outputVariable: 'doc\_type'  
        }, context);  
          
        documentClassification \= classificationResult.result;  
          
        *// Extract entities based on document type using specialized prompts*  
        const entityPrompt \= this.buildEntityExtractionPrompt(extractedContent, documentClassification);  
          
        analysisResult \= await this.aiEngine.executeAIQuery({  
          warehouse: 'snowflake',  
          function: 'AI\_COMPLETE',  
          model: 'claude-3-5-sonnet',  
          prompt: entityPrompt,  
          parameters: { max\_tokens: 2048, temperature: 0.1 },  
          outputVariable: 'extracted\_entities'  
        }, context);  
        break;  
          
      case 'summarization':  
        analysisResult \= await this.aiEngine.executeAIQuery({  
          warehouse: 'snowflake',  
          function: 'SUMMARIZE',  
          prompt: extractedContent,  
          parameters: { length: 'medium' }, *// short, medium, long*  
          outputVariable: 'document\_summary'  
        }, context);  
        break;  
          
      case 'extraction':  
      default:  
        analysisResult \= await this.aiEngine.executeAIQuery({  
          warehouse: 'snowflake',  
          function: 'AI\_COMPLETE',  
          model: 'llama3.1-70b',  
          prompt: \`Extract key information from this document in JSON format: ${extractedContent}\`,  
          parameters: { max\_tokens: 4096, temperature: 0.1 },  
          outputVariable: 'extracted\_data'  
        }, context);  
        break;  
    }  
      
    return {  
      documentType: documentClassification,  
      extractedText: extractedContent,  
      structuredData: this.parseStructuredData(analysisResult.result),  
      entities: this.parseEntities(analysisResult.result),  
      confidence: analysisResult.confidence || 0.8,  
      processingTime: Date.now() \- startTime  
    };  
  }  
    
  private buildEntityExtractionPrompt(content: string, documentType: string): string {  
    const entityMappings \= {  
      'invoice': \['company\_name', 'invoice\_number', 'date', 'amount', 'tax\_amount', 'due\_date', 'line\_items'\],  
      'contract': \['parties', 'contract\_date', 'term', 'value', 'termination\_clause', 'payment\_terms'\],  
      'report': \['title', 'author', 'date', 'key\_metrics', 'conclusions', 'recommendations'\],  
      'correspondence': \['sender', 'recipient', 'date', 'subject', 'action\_items', 'priority'\]  
    };  
      
    const entities \= entityMappings\[documentType\] || \['names', 'dates', 'amounts', 'addresses'\];  
      
    return \`Extract the following entities from this ${documentType} document: ${entities.join(', ')}.   
            Return the results in JSON format with entity types as keys and extracted values as values.  
            Provide confidence scores for each extraction.  
            Document content: ${content}\`;  
  }  
    
  private parseStructuredData(result: string): Record\<string, any\> {  
    try {  
      return JSON.parse(result);  
    } catch {  
      *// Fallback for non-JSON responses*  
      return { raw\_result: result };  
    }  
  }  
    
  private parseEntities(result: string): EntityExtractionResult\[\] {  
    try {  
      const parsed \= JSON.parse(result);  
      return Object.entries(parsed).map((\[type, value\]) \=\> ({  
        type,  
        value: String(value),  
        confidence: 0.8 *// Could be enhanced with actual confidence from AI response*  
      }));  
    } catch {  
      return \[\];  
    }  
  }  
}

### **Image Processing Capabilities**

Advanced Image Analysis:

typescript  
*// Extension of MultiModalAIProcessor class*

async processImage(  
  imageBuffer: Buffer,  
  analysisType: 'description' | 'classification' | 'text\_extraction' | 'chart\_analysis',  
  context: ActionContext  
): Promise\<ImageProcessingResult\> {  
    
  const imageBase64 \= imageBuffer.toString('base64');  
  const imageDataUrl \= \`data:image/png;base64,${imageBase64}\`;  
  const startTime \= Date.now();  
    
  let aiQuery: AIQuery;  
    
  switch (analysisType) {  
    case 'description':  
      aiQuery \= {  
        warehouse: 'snowflake',  
        function: 'AI\_COMPLETE',  
        model: 'claude-3-5-sonnet',  
        prompt: \`Describe this image in detail, focusing on business-relevant information and actionable insights: ${imageDataUrl}\`,  
        parameters: { max\_tokens: 1024, temperature: 0.3 },  
        outputVariable: 'image\_description'  
      };  
      break;  
        
    case 'classification':  
      aiQuery \= {  
        warehouse: 'snowflake',  
        function: 'AI\_CLASSIFY',  
        prompt: imageDataUrl,  
        parameters: {   
          categories: \['chart', 'document', 'product', 'person', 'screenshot', 'diagram', 'form', 'invoice'\]   
        },  
        outputVariable: 'image\_classification'  
      };  
      break;  
        
    case 'text\_extraction':  
      aiQuery \= {  
        warehouse: 'snowflake',  
        function: 'AI\_COMPLETE',  
        model: 'claude-3-5-sonnet',  
        prompt: \`Extract all text visible in this image. Format as plain text with preserved structure: ${imageDataUrl}\`,  
        parameters: { max\_tokens: 2048, temperature: 0.1 },  
        outputVariable: 'extracted\_text'  
      };  
      break;  
        
    case 'chart\_analysis':  
      aiQuery \= {  
        warehouse: 'snowflake',  
        function: 'AI\_COMPLETE',  
        model: 'claude-3-5-sonnet',  
        prompt: \`Analyze this chart/graph image and extract:  
                 1\. Chart type and structure  
                 2\. Key data points and trends  
                 3\. Axis labels and units  
                 4\. Main insights and patterns  
                 5\. Data in JSON format if possible  
                 Image: ${imageDataUrl}\`,  
        parameters: { max\_tokens: 3072, temperature: 0.2 },  
        outputVariable: 'chart\_analysis'  
      };  
      break;  
        
    default:  
      throw new Error(\`Unsupported image analysis type: ${analysisType}\`);  
  }  
    
  const result \= await this.aiEngine.executeAIQuery(aiQuery, context);  
    
  return {  
    analysisType,  
    result: result.result,  
    structuredData: this.parseStructuredData(result.result),  
    confidence: result.confidence || 0.8,  
    processingTime: Date.now() \- startTime  
  };  
}  
---

# **7\. Technical Implementation Guide**

## **Overview and Implementation Strategy**

The Technical Implementation Guide provides comprehensive, production-ready guidance for building, deploying, and maintaining Sigma-compatible data applications. This section serves as the bridge between conceptual understanding and real-world implementation, covering project architecture, configuration management, API development, and deployment strategies.

### **Implementation Objectives**

1\. Scalable Project Architecture

* Establish maintainable, modular project structures that support long-term development  
* Separate concerns between frontend, backend, shared types, and infrastructure  
* Enable team collaboration with clear component boundaries and interfaces

2\. Production-Ready Configuration

* Implement comprehensive environment-based configuration management  
* Support multiple deployment environments (development, staging, production)  
* Provide security-first configuration with proper credential management

3\. Enterprise Integration Patterns

* Enable seamless integration with existing enterprise systems and workflows  
* Support multiple authentication and authorization mechanisms  
* Provide comprehensive monitoring, logging, and observability capabilities

4\. Development Productivity

* Accelerate development with reusable components and established patterns  
* Provide clear development workflows and testing strategies  
* Include comprehensive documentation and debugging tools

---

## **7.1 Project Setup and Architecture**

### **Recommended Project Structure**

The following project structure provides a scalable foundation for building enterprise-grade Sigma-compatible applications:

text  
sigma-compatible-app/  
├── frontend/                          \# React/Vue frontend application  
│   ├── src/  
│   │   ├── components/  
│   │   │   ├── layout/               \# Sigma layout components  
│   │   │   │   ├── SigmaContainer.tsx  
│   │   │   │   ├── SigmaModal.tsx  
│   │   │   │   ├── SigmaPopover.tsx  
│   │   │   │   └── TabbedContainer.tsx  
│   │   │   ├── input-tables/         \# Input table components  
│   │   │   │   ├── Input

# **7.2 API Development**

## **Overview and Implementation Strategy**

The API Development section provides comprehensive guidance for building production-ready RESTful APIs that serve as the bridge between frontend applications and warehouse-native processing. These APIs handle action execution, data manipulation, AI processing, and real-time status monitoring while maintaining enterprise-grade security, performance, and reliability standards.

### **API Development Objectives**

1\. RESTful Architecture

* Implement consistent, intuitive API endpoints that follow REST principles  
* Provide comprehensive request validation and error handling  
* Support real-time status monitoring and progress tracking for long-running operations

2\. Production-Ready Controllers

* Handle complex action sequences with proper error recovery and rollback mechanisms  
* Implement comprehensive logging and audit trails for compliance and debugging  
* Support concurrent operations with proper resource management and throttling

3\. Enterprise Security and Performance

* Integrate authentication and authorization mechanisms seamlessly  
* Implement rate limiting, request validation, and input sanitization  
* Provide comprehensive monitoring and observability capabilities

4\. Scalable Integration Patterns

* Enable seamless integration with existing enterprise systems and workflows  
* Support webhook notifications and real-time event broadcasting  
* Provide flexible configuration for different deployment environments

---

## **RESTful API Structure**

### **Action Controller Implementation**

The Action Controller manages the execution, monitoring, and control of action sequences, providing real-time feedback and comprehensive error handling.

Core Controller Architecture:

typescript  
*// backend/src/controllers/actionController.ts*  
import { Request, Response } from 'express';  
import { ActionEngine } from '../services/ActionEngine';  
import { validateActionSequence } from '../utils/validation';  
import { AuditLogger } from '../utils/logger';

export class ActionController {  
  constructor(  
    private actionEngine: ActionEngine,  
    private auditLogger: AuditLogger  
  ) {}  
    
  *// Execute action sequence with comprehensive error handling*  
  async executeSequence(req: Request, res: Response): Promise\<void\> {  
    try {  
      const { sequenceId, context } \= req.body;  
      const userId \= req.user.id;  
        
      *// Validate request payload*  
      const validation \= validateActionSequence(req.body);  
      if (\!validation.valid) {  
        res.status(400).json({   
          error: 'Invalid request payload',   
          details: validation.errors,  
          timestamp: new Date().toISOString()  
        });  
        return;  
      }  
        
      *// Enrich context with user information and execution metadata*  
      const actionContext \= {  
        ...context,  
        userId,  
        startTime: Date.now(),  
        requestId: req.headers\['x-request-id'\] || \`req\_${Date.now()}\`,  
        userAgent: req.headers\['user-agent'\],  
        ipAddress: req.ip  
      };  
        
      *// Execute sequence with comprehensive monitoring*  
      const result \= await this.actionEngine.executeSequence(sequenceId, actionContext);  
        
      *// Log successful execution for audit and analytics*  
      await this.auditLogger.log('action\_sequence\_api\_success', {  
        sequence\_id: sequenceId,  
        user\_id: userId,  
        request\_id: actionContext.requestId,  
        execution\_time: Date.now() \- actionContext.startTime,  
        actions\_count: result.actionsExecuted,  
        data\_modified: result.dataModified  
      });  
        
      res.json({  
        success: true,  
        sequenceId,  
        result: {  
          executionId: result.executionId,  
          actionsExecuted: result.actionsExecuted,  
          dataModified: result.dataModified,  
          outputVariables: result.outputVariables  
        },  
        executionTime: Date.now() \- actionContext.startTime,  
        timestamp: new Date().toISOString()  
      });  
        
    } catch (error) {  
      *// Comprehensive error logging for debugging and monitoring*  
      await this.auditLogger.log('action\_sequence\_api\_error', {  
        sequence\_id: req.body.sequenceId,  
        user\_id: req.user?.id,  
        request\_id: req.headers\['x-request-id'\],  
        error\_message: error.message,  
        error\_stack: error.stack,  
        request\_payload: JSON.stringify(req.body)  
      });  
        
      *// Return structured error response*  
      res.status(500).json({  
        success: false,  
        error: {  
          message: error.message,  
          type: error.constructor.name,  
          timestamp: new Date().toISOString(),  
          requestId: req.headers\['x-request-id'\]  
        }  
      });  
    }  
  }  
    
  *// Get real-time action sequence status and progress*  
  async getSequenceStatus(req: Request, res: Response): Promise\<void\> {  
    try {  
      const { sequenceId } \= req.params;  
      const status \= await this.actionEngine.getSequenceStatus(sequenceId);  
        
      if (\!status) {  
        res.status(404).json({  
          error: 'Action sequence not found',  
          sequenceId,  
          timestamp: new Date().toISOString()  
        });  
        return;  
      }  
        
      res.json({  
        sequenceId,  
        status: status.status, *// 'running', 'completed', 'failed', 'paused'*  
        progress: {  
          current: status.currentActionIndex,  
          total: status.totalActions,  
          percentage: Math.round((status.currentActionIndex / status.totalActions) \* 100)  
        },  
        currentAction: status.currentAction,  
        startTime: status.startTime,  
        estimatedCompletion: status.estimatedCompletion,  
        outputVariables: status.outputVariables,  
        timestamp: new Date().toISOString()  
      });  
        
    } catch (error) {  
      res.status(500).json({  
        error: error.message,  
        timestamp: new Date().toISOString()  
      });  
    }  
  }  
    
  *// Control sequence execution (pause, resume, stop)*  
  async controlSequence(req: Request, res: Response): Promise\<void\> {  
    try {  
      const { sequenceId } \= req.params;  
      const { action } \= req.body; *// 'pause' | 'resume' | 'stop'*  
      const userId \= req.user.id;  
        
      *// Validate control action*  
      const validActions \= \['pause', 'resume', 'stop'\];  
      if (\!validActions.includes(action)) {  
        res.status(400).json({   
          error: 'Invalid control action',  
          validActions,  
          received: action  
        });  
        return;  
      }  
        
      let result: any;  
      switch (action) {  
        case 'pause':  
          result \= await this.actionEngine.pauseSequence(sequenceId);  
          break;  
        case 'resume':  
          result \= await this.actionEngine.resumeSequence(sequenceId);  
          break;  
        case 'stop':  
          result \= await this.actionEngine.stopSequence(sequenceId);  
          break;  
      }  
        
      *// Log control action for audit trail*  
      await this.auditLogger.log('action\_sequence\_control', {  
        sequence\_id: sequenceId,  
        control\_action: action,  
        user\_id: userId,  
        timestamp: new Date().toISOString()  
      });  
        
      res.json({  
        sequenceId,  
        action,  
        success: true,  
        result,  
        timestamp: new Date().toISOString()  
      });  
        
    } catch (error) {  
      res.status(500).json({  
        error: error.message,  
        timestamp: new Date().toISOString()  
      });  
    }  
  }  
    
  *// Get user's action execution history*  
  async getActionHistory(req: Request, res: Response): Promise\<void\> {  
    try {  
      const userId \= req.user.id;  
      const { page \= 1, limit \= 50, status, dateFrom, dateTo } \= req.query;  
        
      const filters \= {  
        userId,  
        status: status as string,  
        dateFrom: dateFrom as string,  
        dateTo: dateTo as string  
      };  
        
      const history \= await this.actionEngine.getActionHistory(filters, {  
        page: parseInt(page as string),  
        limit: Math.min(parseInt(limit as string), 100) *// Cap at 100 records*  
      });  
        
      res.json({  
        history: history.records,  
        pagination: {  
          currentPage: history.page,  
          totalPages: history.totalPages,  
          totalRecords: history.totalRecords,  
          hasNext: history.hasNext,  
          hasPrevious: history.hasPrevious  
        },  
        timestamp: new Date().toISOString()  
      });  
        
    } catch (error) {  
      res.status(500).json({  
        error: error.message,  
        timestamp: new Date().toISOString()  
      });  
    }  
  }  
}

### **API Routes Configuration**

Comprehensive Route Setup with Security and Validation:

typescript  
*// backend/src/routes/actions.ts*  
import { Router } from 'express';  
import { ActionController } from '../controllers/actionController';  
import { authenticate } from '../middleware/auth';  
import { rateLimit } from '../middleware/rateLimit';  
import { validateRequest } from '../middleware/validation';  
import { actionSequenceSchema } from '../schemas/actionSchemas';

export const createActionRoutes \= (actionController: ActionController): Router \=\> {  
  const router \= Router();  
    
  *// Apply authentication to all routes*  
  router.use(authenticate);  
    
  *// Execute action sequence with strict rate limiting*  
  router.post('/execute',   
    rateLimit({   
      windowMs: 60000, *// 1 minute window*  
      max: 30, *// 30 requests per minute per user*  
      message: 'Too many action executions, please try again later',  
      standardHeaders: true,  
      legacyHeaders: false  
    }),  
    validateRequest(actionSequenceSchema),  
    actionController.executeSequence.bind(actionController)  
  );  
    
  *// Get sequence status with moderate rate limiting*  
  router.get('/sequences/:sequenceId/status',  
    rateLimit({ windowMs: 60000, max: 100 }), *// 100 status checks per minute*  
    actionController.getSequenceStatus.bind(actionController)  
  );  
    
  *// Control sequence execution with validation*  
  router.post('/sequences/:sequenceId/control',  
    validateRequest({   
      type: 'object',   
      properties: {   
        action: {   
          type: 'string',   
          enum: \['pause', 'resume', 'stop'\]   
        }   
      },  
      required: \['action'\]  
    }),  
    actionController.controlSequence.bind(actionController)  
  );  
    
  *// Get user's action history with query parameter validation*  
  router.get('/history',  
    validateRequest({  
      type: 'object',  
      properties: {  
        page: { type: 'string', pattern: '^\[0-9\]+$' },  
        limit: { type: 'string', pattern: '^\[0-9\]+$' },  
        status: { type: 'string', enum: \['running', 'completed', 'failed', 'paused'\] },  
        dateFrom: { type: 'string', format: 'date' },  
        dateTo: { type: 'string', format: 'date' }  
      }  
    }, 'query'),  
    actionController.getActionHistory.bind(actionController)  
  );  
    
  return router;  
};  
---

# **7.3 Deployment and Integration**

## **Overview and Production Strategy**

The Deployment and Integration section provides enterprise-grade deployment strategies, infrastructure setup, and monitoring solutions for Sigma-compatible applications. This comprehensive approach ensures reliable, scalable, and maintainable production deployments that integrate seamlessly with existing enterprise infrastructure.

### **Deployment Objectives**

1\. Production-Ready Architecture

* Implement containerized deployment strategies with proper orchestration  
* Support multiple deployment environments (development, staging, production)  
* Provide high availability and fault tolerance through redundant services

2\. Enterprise Integration

* Enable seamless integration with existing enterprise systems and workflows  
* Support multiple authentication providers and security protocols  
* Provide comprehensive monitoring, logging, and alerting capabilities

3\. Continuous Delivery

* Implement robust CI/CD pipelines with automated testing and security scanning  
* Support blue-green deployments and rollback mechanisms  
* Provide comprehensive quality gates and approval workflows

4\. Observability and Monitoring

* Implement comprehensive health checking and performance monitoring  
* Support distributed tracing and error tracking  
* Provide real-time alerting and incident response capabilities

---

## **Production Deployment Architecture**

### **Container-Based Deployment**

Comprehensive Docker Compose Configuration:

yaml  
*\# docker/docker-compose.production.yml*  
version: '3.8'  
services:  
  frontend:  
    build:  
      context: ../frontend  
      dockerfile: ../infrastructure/docker/Dockerfile.frontend  
      args:  
        \- BUILD\_ENV=production  
    ports:  
      \- "80:80"  
      \- "443:443"  
    environment:  
      \- NODE\_ENV=production  
      \- REACT\_APP\_API\_URL=https://api.yourapp.com  
      \- REACT\_APP\_ENABLE\_SIGMA\_INTEGRATION=true  
      \- REACT\_APP\_SENTRY\_DSN=${SENTRY\_DSN}  
    volumes:  
      \- ./ssl:/etc/ssl/certs:ro  
      \- ./nginx/conf.d:/etc/nginx/conf.d:ro  
    depends\_on:  
      \- backend  
    restart: unless-stopped  
    healthcheck:  
      test: \["CMD", "curl", "-f", "http://localhost/health"\]  
      interval: 30s  
      timeout: 10s  
      retries: 3

  backend:  
    build:  
      context: ../backend  
      dockerfile: ../infrastructure/docker/Dockerfile.backend  
    ports:  
      \- "3001:3001"  
    environment:  
      \- NODE\_ENV=production  
      \- WAREHOUSE\_TYPE=${WAREHOUSE\_TYPE}  
      \- WAREHOUSE\_HOST=${WAREHOUSE\_HOST}  
      \- WAREHOUSE\_DATABASE=${WAREHOUSE\_DATABASE}  
      \- WAREHOUSE\_SCHEMA=${WAREHOUSE\_SCHEMA}  
      \- AI\_ENABLED=true  
      \- ENABLE\_AUDIT\_LOGGING=true  
      \- JWT\_SECRET=${JWT\_SECRET}  
      \- ENCRYPTION\_KEY=${ENCRYPTION\_KEY}  
      \- REDIS\_URL=redis://:${REDIS\_PASSWORD}@redis:6379  
      \- POSTGRES\_URL=postgresql://${POSTGRES\_USER}:${POSTGRES\_PASSWORD}@postgres:5432/${POSTGRES\_DB}  
    env\_file:  
      \- .env.production  
    volumes:  
      \- ./logs:/app/logs  
      \- ./uploads:/app/uploads:rw  
      \- ./temp:/app/temp:rw  
    depends\_on:  
      \- redis  
      \- postgres  
    restart: unless-stopped  
    healthcheck:  
      test: \["CMD", "curl", "-f", "http://localhost:3001/health"\]  
      interval: 30s  
      timeout: 10s  
      retries: 3  
      start\_period: 60s

  redis:  
    image: redis:7-alpine  
    ports:  
      \- "6379:6379"  
    environment:  
      \- REDIS\_PASSWORD=${REDIS\_PASSWORD}  
    volumes:  
      \- redis\_data:/data  
    restart: unless-stopped  
    command: redis-server \--appendonly yes \--requirepass ${REDIS\_PASSWORD} \--maxmemory 512mb \--maxmemory-policy allkeys-lru  
    healthcheck:  
      test: \["CMD", "redis-cli", "--no-auth-warning", "-a", "${REDIS\_PASSWORD}", "ping"\]  
      interval: 30s  
      timeout: 10s  
      retries: 3

  postgres:  
    image: postgres:15-alpine  
    ports:  
      \- "5432:5432"  
    environment:  
      \- POSTGRES\_DB=${POSTGRES\_DB}  
      \- POSTGRES\_USER=${POSTGRES\_USER}  
      \- POSTGRES\_PASSWORD=${POSTGRES\_PASSWORD}  
    volumes:  
      \- postgres\_data:/var/lib/postgresql/data  
      \- ./database/init:/docker-entrypoint-initdb.d:ro  
      \- ./database/backups:/backups:rw  
    restart: unless-stopped  
    healthcheck:  
      test: \["CMD-SHELL", "pg\_isready \-U ${POSTGRES\_USER} \-d ${POSTGRES\_DB}"\]  
      interval: 30s  
      timeout: 10s  
      retries: 3

  *\# Monitoring and observability*  
  prometheus:  
    image: prom/prometheus:latest  
    ports:  
      \- "9090:9090"  
    volumes:  
      \- ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro  
      \- prometheus\_data:/prometheus  
    command:  
      \- '--config.file=/etc/prometheus/prometheus.yml'  
      \- '--storage.tsdb.path=/prometheus'  
      \- '--web.console.libraries=/etc/prometheus/console\_libraries'  
      \- '--web.console.templates=/etc/prometheus/consoles'  
    restart: unless-stopped

volumes:  
  redis\_data:  
    driver: local  
  postgres\_data:  
    driver: local  
  prometheus\_data:  
    driver: local

networks:  
  default:  
    name: sigma-app-network  
    driver: bridge

# **7.4 Monitoring, Observability, and Integration**

## **Overview and Implementation Strategy**

This section completes the Technical Implementation Guide with comprehensive monitoring, error tracking, and Sigma integration patterns. These capabilities ensure production-ready applications with enterprise-grade observability, seamless Sigma ecosystem integration, and automated operational management.

### **Integration and Monitoring Objectives**

1\. Production Monitoring and Observability

* Implement comprehensive health checking, metrics collection, and performance monitoring  
* Provide real-time error tracking and incident response capabilities  
* Support distributed tracing and application performance monitoring (APM)

2\. Seamless Sigma Integration

* Enable embedded application patterns with secure cross-origin communication  
* Provide real-time synchronization with Sigma workbooks and controls  
* Support bidirectional data flow and event handling between applications

3\. Automated Schema Management

* Implement automated warehouse schema synchronization for input tables  
* Provide comprehensive permission management and security controls  
* Support schema evolution and migration strategies

---

## **Health Check and Monitoring Implementation**

### **Comprehensive Monitoring Service**

Production-Ready Health Checking:

typescript  
*// backend/src/middleware/monitoring.ts*  
import { Request, Response, NextFunction } from 'express';  
import { performance } from 'perf\_hooks';  
import { logger } from '../utils/logger';

export interface HealthCheckResult {  
  status: 'healthy' | 'degraded' | 'unhealthy';  
  timestamp: string;  
  uptime: number;  
  version: string;  
  environment: string;  
  services: {  
    \[key: string\]: {  
      status: 'up' | 'down' | 'degraded';  
      responseTime?: number;  
      details?: string;  
      lastCheck?: string;  
    };  
  };  
  system: {  
    memory: {  
      used: number;  
      free: number;  
      total: number;  
      percentage: number;  
    };  
    cpu: {  
      usage: number;  
      loadAverage: number\[\];  
    };  
  };  
}

export class HealthCheckService {  
  private lastHealthCheck: HealthCheckResult | null \= null;  
  private healthCheckInterval: NodeJS.Timeout | null \= null;  
    
  constructor(  
    private warehouseConnection: WarehouseConnection,  
    private redis: RedisClient,  
    private aiEngine: AIEngine  
  ) {  
    *// Start periodic health checks*  
    this.startPeriodicHealthChecks();  
  }  
    
  private startPeriodicHealthChecks(): void {  
    this.healthCheckInterval \= setInterval(async () \=\> {  
      try {  
        this.lastHealthCheck \= await this.performHealthCheck();  
      } catch (error) {  
        logger.error('Health check failed', { error: error.message });  
      }  
    }, 30000); *// Check every 30 seconds*  
  }  
    
  async performHealthCheck(): Promise\<HealthCheckResult\> {  
    const startTime \= performance.now();  
    const services: any \= {};  
      
    *// Check warehouse connection with timeout*  
    try {  
      const warehouseStart \= performance.now();  
      const timeoutPromise \= new Promise((\_, reject) \=\>   
        setTimeout(() \=\> reject(new Error('Warehouse health check timeout')), 5000)  
      );  
        
      const healthQuery \= this.warehouseConnection.execute('SELECT 1 as health\_check, CURRENT\_TIMESTAMP as check\_time');  
      await Promise.race(\[healthQuery, timeoutPromise\]);  
        
      services.warehouse \= {  
        status: 'up',  
        responseTime: Math.round(performance.now() \- warehouseStart),  
        lastCheck: new Date().toISOString()  
      };  
    } catch (error) {  
      services.warehouse \= {  
        status: 'down',  
        details: error.message,  
        lastCheck: new Date().toISOString()  
      };  
    }  
      
    *// Check Redis connection*  
    try {  
      const redisStart \= performance.now();  
      await Promise.race(\[  
        this.redis.ping(),  
        new Promise((\_, reject) \=\> setTimeout(() \=\> reject(new Error('Redis timeout')), 3000))  
      \]);  
        
      services.redis \= {  
        status: 'up',  
        responseTime: Math.round(performance.now() \- redisStart),  
        lastCheck: new Date().toISOString()  
      };  
    } catch (error) {  
      services.redis \= {  
        status: 'down',  
        details: error.message,  
        lastCheck: new Date().toISOString()  
      };  
    }  
      
    *// Check AI service availability*  
    if (process.env.AI\_ENABLED \=== 'true') {  
      try {  
        const aiStart \= performance.now();  
        await this.aiEngine.healthCheck();  
        services.ai \= {  
          status: 'up',  
          responseTime: Math.round(performance.now() \- aiStart),  
          lastCheck: new Date().toISOString()  
        };  
      } catch (error) {  
        services.ai \= {  
          status: 'down',  
          details: error.message,  
          lastCheck: new Date().toISOString()  
        };  
      }  
    }  
      
    *// System metrics*  
    const memUsage \= process.memoryUsage();  
    const cpuUsage \= process.cpuUsage();  
      
    *// Determine overall health status*  
    const downServices \= Object.values(services).filter((service: any) \=\> service.status \=== 'down');  
    const degradedServices \= Object.values(services).filter((service: any) \=\> service.status \=== 'degraded');  
      
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' \= 'healthy';  
    if (downServices.length \> 0) {  
      overallStatus \= 'unhealthy';  
    } else if (degradedServices.length \> 0) {  
      overallStatus \= 'degraded';  
    }  
      
    return {  
      status: overallStatus,  
      timestamp: new Date().toISOString(),  
      uptime: process.uptime(),  
      version: process.env.APP\_VERSION || '1.0.0',  
      environment: process.env.NODE\_ENV || 'development',  
      services,  
      system: {  
        memory: {  
          used: memUsage.heapUsed,  
          free: memUsage.heapTotal \- memUsage.heapUsed,  
          total: memUsage.heapTotal,  
          percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) \* 100)  
        },  
        cpu: {  
          usage: Math.round((cpuUsage.user \+ cpuUsage.system) / 1000000), *// Convert to milliseconds*  
          loadAverage: process.platform \!== 'win32' ? require('os').loadavg() : \[0, 0, 0\]  
        }  
      }  
    };  
  }  
    
  getLastHealthCheck(): HealthCheckResult | null {  
    return this.lastHealthCheck;  
  }  
    
  stop(): void {  
    if (this.healthCheckInterval) {  
      clearInterval(this.healthCheckInterval);  
    }  
  }  
}

### **Metrics and Error Tracking Middleware**

Production Metrics Collection:

typescript  
*// Metrics collection middleware*  
export const metricsMiddleware \= (req: Request, res: Response, next: NextFunction) \=\> {  
  const startTime \= Date.now();  
  const startCpuUsage \= process.cpuUsage();  
    
  res.on('finish', () \=\> {  
    const duration \= Date.now() \- startTime;  
    const cpuUsage \= process.cpuUsage(startCpuUsage);  
    const route \= req.route?.path || req.path;  
      
    *// Log comprehensive request metrics*  
    logger.info('request\_metrics', {  
      method: req.method,  
      route,  
      statusCode: res.statusCode,  
      duration,  
      cpuTime: (cpuUsage.user \+ cpuUsage.system) / 1000000, *// Convert to milliseconds*  
      userAgent: req.get('User-Agent'),  
      ip: req.ip,  
      userId: req.user?.id,  
      requestSize: req.get('Content-Length') || 0,  
      responseSize: res.get('Content-Length') || 0,  
      timestamp: new Date().toISOString()  
    });  
      
    *// Send to monitoring system (Prometheus, DataDog, etc.)*  
    if (global.metricsCollector) {  
      global.metricsCollector.recordHttpRequest({  
        method: req.method,  
        route,  
        statusCode: res.statusCode,  
        duration,  
        cpuTime: (cpuUsage.user \+ cpuUsage.system) / 1000000  
      });  
    }  
  });  
    
  next();  
};

*// Comprehensive error tracking middleware*  
export const errorTrackingMiddleware \= (error: Error, req: Request, res: Response, next: NextFunction) \=\> {  
  const errorId \= \`err\_${Date.now()}\_${Math.random().toString(36).substr(2, 9)}\`;  
    
  *// Log comprehensive error details*  
  logger.error('application\_error', {  
    errorId,  
    message: error.message,  
    stack: error.stack,  
    name: error.name,  
    route: req.path,  
    method: req.method,  
    userId: req.user?.id,  
    requestId: req.headers\['x-request-id'\],  
    userAgent: req.get('User-Agent'),  
    ip: req.ip,  
    body: req.body,  
    query: req.query,  
    params: req.params,  
    timestamp: new Date().toISOString()  
  });  
    
  *// Send to error tracking service (Sentry, Bugsnag, etc.)*  
  if (global.errorTracker) {  
    global.errorTracker.captureException(error, {  
      user: {  
        id: req.user?.id,  
        ip: req.ip,  
        userAgent: req.get('User-Agent')  
      },  
      request: {  
        method: req.method,  
        url: req.url,  
        headers: req.headers,  
        query: req.query  
      },  
      extra: {  
        errorId,  
        route: req.path,  
        requestId: req.headers\['x-request-id'\]  
      },  
      tags: {  
        environment: process.env.NODE\_ENV,  
        version: process.env.APP\_VERSION  
      }  
    });  
  }  
    
  *// Add error ID to response for troubleshooting*  
  res.locals.errorId \= errorId;  
  next(error);  
};  
---

## **Sigma Integration Patterns**

### **Embedded Application Pattern**

Secure Cross-Origin Communication:

typescript  
*// frontend/src/services/sigmaEmbedding.ts*  
export class SigmaEmbeddingService {  
  private messageHandlers: Map\<string, Function\> \= new Map();  
  private trustedOrigins: string\[\] \= \[\];  
  private isInitialized: boolean \= false;  
  private sigmaContext: any \= null;  
    
  constructor(trustedOrigins: string\[\]) {  
    this.trustedOrigins \= trustedOrigins;  
    this.setupMessageListener();  
  }  
    
  private setupMessageListener(): void {  
    window.addEventListener('message', (event) \=\> {  
      *// Verify origin for security \- critical for embedded apps*  
      if (\!this.isTrustedOrigin(event.origin)) {  
        console.warn(\`Received message from untrusted origin: ${event.origin}\`);  
        return;  
      }  
        
      try {  
        this.handleInboundMessage(event.data);  
      } catch (error) {  
        console.error('Error handling Sigma message:', error);  
      }  
    });  
      
    *// Signal readiness to Sigma parent*  
    this.signalReadiness();  
  }  
    
  private isTrustedOrigin(origin: string): boolean {  
    return this.trustedOrigins.some(trusted \=\> {  
      if (trusted.includes('\*')) {  
        const pattern \= trusted.replace(/\\\*/g, '.\*');  
        return new RegExp(\`^${pattern}$\`).test(origin);  
      }  
      return trusted \=== origin;  
    });  
  }  
    
  private signalReadiness(): void {  
    *// Let Sigma know the embedded app is ready*  
    setTimeout(() \=\> {  
      this.sendToSigma('app:ready', {  
        version: process.env.REACT\_APP\_VERSION || '1.0.0',  
        capabilities: \['input-tables', 'actions', 'ai-processing', 'real-time-sync'\]  
      });  
    }, 100);  
  }  
    
  private handleInboundMessage(message: any): void {  
    if (\!message || typeof message \!== 'object') return;  
      
    const { type, payload, messageId } \= message;  
      
    *// Acknowledge message receipt*  
    if (messageId) {  
      this.sendToSigma('message:ack', { messageId });  
    }  
      
    switch (type) {  
      case 'sigma:workbook:loaded':  
        this.handleWorkbookLoaded(payload);  
        break;  
      case 'sigma:element:selected':  
        this.handleElementSelection(payload);  
        break;  
      case 'sigma:control:changed':  
        this.handleControlChange(payload);  
        break;  
      case 'sigma:action:triggered':  
        this.handleSigmaActionTriggered(payload);  
        break;  
      case 'sigma:data:updated':  
        this.handleDataUpdated(payload);  
        break;  
      case 'sigma:theme:changed':  
        this.handleThemeChanged(payload);  
        break;  
      default:  
        console.warn(\`Unhandled Sigma message type: ${type}\`);  
    }  
  }  
    
  *// Send events to Sigma parent with error handling*  
  sendToSigma(eventType: string, payload: any): void {  
    const message \= {  
      source: 'sigma-compatible-app',  
      type: eventType,  
      payload,  
      messageId: \`msg\_${Date.now()}\_${Math.random().toString(36).substr(2, 9)}\`,  
      timestamp: new Date().toISOString()  
    };  
      
    try {  
      window.parent.postMessage(message, '\*');  
    } catch (error) {  
      console.error('Failed to send message to Sigma:', error);  
    }  
  }  
    
  *// Specific integration methods with comprehensive error handling*  
  updateSigmaControl(controlId: string, value: any): Promise\<void\> {  
    return new Promise((resolve, reject) \=\> {  
      const messageId \= \`ctrl\_${Date.now()}\`;  
        
      *// Set up response handler*  
      const timeout \= setTimeout(() \=\> {  
        this.messageHandlers.delete(messageId);  
        reject(new Error('Control update timeout'));  
      }, 5000);  
        
      this.messageHandlers.set(messageId, (response: any) \=\> {  
        clearTimeout(timeout);  
        this.messageHandlers.delete(messageId);  
          
        if (response.success) {  
          resolve();  
        } else {  
          reject(new Error(response.error || 'Control update failed'));  
        }  
      });  
        
      this.sendToSigma('control:update', {  
        controlId,  
        value,  
        messageId  
      });  
    });  
  }  
    
  triggerSigmaAction(actionId: string, context: any): void {  
    this.sendToSigma('action:trigger', {  
      actionId,  
      context: {  
        ...context,  
        source: 'embedded-app',  
        timestamp: new Date().toISOString()  
      }  
    });  
  }  
    
  refreshSigmaElement(elementId: string): void {  
    this.sendToSigma('element:refresh', {  
      elementId,  
      timestamp: new Date().toISOString()  
    });  
  }  
    
  *// Event handlers for Sigma interactions*  
  private handleWorkbookLoaded(payload: any): void {  
    console.log('Sigma workbook loaded:', payload);  
    this.sigmaContext \= payload;  
    this.isInitialized \= true;  
      
    *// Notify app components that Sigma context is available*  
    window.dispatchEvent(new CustomEvent('sigma:initialized', {   
      detail: payload   
    }));  
  }  
    
  private handleElementSelection(payload: any): void {  
    console.log('Sigma element selected:', payload);  
      
    *// Update app state based on Sigma selection*  
    window.dispatchEvent(new CustomEvent('sigma:selection:changed', {   
      detail: payload   
    }));  
  }  
    
  private handleControlChange(payload: any): void {  
    console.log('Sigma control changed:', payload);  
      
    *// Sync control changes with app state*  
    window.dispatchEvent(new CustomEvent('sigma:control:changed', {   
      detail: payload   
    }));  
  }  
    
  private handleSigmaActionTriggered(payload: any): void {  
    console.log('Sigma action triggered:', payload);  
      
    *// Execute corresponding app logic*  
    window.dispatchEvent(new CustomEvent('sigma:action:triggered', {   
      detail: payload   
    }));  
  }  
    
  private handleDataUpdated(payload: any): void {  
    console.log('Sigma data updated:', payload);  
      
    *// Refresh relevant app components*  
    window.dispatchEvent(new CustomEvent('sigma:data:updated', {   
      detail: payload   
    }));  
  }  
    
  private handleThemeChanged(payload: any): void {  
    console.log('Sigma theme changed:', payload);  
      
    *// Apply theme changes to embedded app*  
    window.dispatchEvent(new CustomEvent('sigma:theme:changed', {   
      detail: payload   
    }));  
  }  
    
  getSigmaContext(): any {  
    return this.sigmaContext;  
  }  
    
  isReady(): boolean {  
    return this.isInitialized;  
  }  
}

*// React hook for comprehensive Sigma integration*  
export const useSigmaIntegration \= () \=\> {  
  const \[sigmaContext, setSigmaContext\] \= useState\<any\>(null);  
  const \[isEmbedded, setIsEmbedded\] \= useState(false);  
  const \[isReady, setIsReady\] \= useState(false);  
  const \[selection, setSelection\] \= useState\<any\>(null);  
  const \[controlValues, setControlValues\] \= useState\<Record\<string, any\>\>({});  
  const embeddingService \= useRef\<SigmaEmbeddingService | null\>(null);  
    
  useEffect(() \=\> {  
    *// Detect if running in embedded context*  
    const embedded \= window \!== window.parent;  
    setIsEmbedded(embedded);  
      
    if (embedded) {  
      embeddingService.current \= new SigmaEmbeddingService(\[  
        'https://\*.sigmacomputing.com',  
        'https://app.sigmacomputing.com',  
        'https://\*.sigmacomputing.io'  
      \]);  
        
      *// Set up event listeners for Sigma events*  
      const handleInitialized \= (event: CustomEvent) \=\> {  
        setSigmaContext(event.detail);  
        setIsReady(true);  
      };  
        
      const handleSelectionChanged \= (event: CustomEvent) \=\> {  
        setSelection(event.detail);  
      };  
        
      const handleControlChanged \= (event: CustomEvent) \=\> {  
        setControlValues(prev \=\> ({  
          ...prev,  
          \[event.detail.controlId\]: event.detail.value  
        }));  
      };  
        
      window.addEventListener('sigma:initialized', handleInitialized);  
      window.addEventListener('sigma:selection:changed', handleSelectionChanged);  
      window.addEventListener('sigma:control:changed', handleControlChanged);  
        
      return () \=\> {  
        window.removeEventListener('sigma:initialized', handleInitialized);  
        window.removeEventListener('sigma:selection:changed', handleSelectionChanged);  
        window.removeEventListener('sigma:control:changed', handleControlChanged);  
      };  
     
