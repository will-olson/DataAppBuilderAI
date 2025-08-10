# 🚀 Sigma SDK Integration Guide
## Building True Sigma-Compatible Data Applications

*This guide explains how to use the official Sigma React SDK integration in GrowthMarketer AI to build data applications that are truly compatible with Sigma's platform.*

---

## 🎯 **What We've Achieved**

### **True Sigma Compatibility**
We've integrated Sigma's official React SDK (`@sigmacomputing/react-embed-sdk` v0.7.0) to provide:
- **Real-time communication** with Sigma workbooks via postMessage
- **Event-driven architecture** for workbook lifecycle and user interactions
- **Variable management** and synchronization
- **Bookmark system** integration
- **TypeScript support** with full type definitions

### **Key Benefits**
1. **Platform Compatibility**: Applications built here can be directly imported into Sigma
2. **Real-time Integration**: Live communication with Sigma workbooks
3. **Developer Experience**: React hooks, TypeScript, and comprehensive event handling
4. **Production Ready**: Uses Sigma's official APIs and event system

---

## 🛠 **Getting Started**

### **1. Access the Development Playground**
Navigate to `/sigma/playground` in the application to access the Sigma development environment.

### **2. Load a Sigma Workbook**
- Enter a Sigma workbook URL (e.g., `https://app.sigmacomputing.com/your-workbook`)
- Use sample workbooks for testing
- Configure display options and controls

### **3. Monitor Real-time Events**
The playground provides real-time monitoring of:
- Workbook lifecycle events
- User interactions
- Variable changes
- Action outbound events
- Bookmark operations

---

## 🔧 **Core Components**

### **SigmaWorkbookEmbed Component**
```tsx
import SigmaWorkbookEmbed from '../sigma/SigmaWorkbookEmbed';

<SigmaWorkbookEmbed
  workbookUrl="https://app.sigmacomputing.com/your-workbook"
  workbookId="custom-id"
  title="My Dashboard"
  height={600}
  showControls={true}
  showVariables={true}
  showBookmarks={true}
  onWorkbookLoaded={handleWorkbookLoaded}
  onError={handleWorkbookError}
  onVariableChange={handleVariableChange}
  onActionOutbound={handleActionOutbound}
/>
```

### **SigmaIntegrationService**
```tsx
import { sigmaIntegrationService } from '../services/sigmaIntegration';

// Initialize integration
await sigmaIntegrationService.initialize(workbookUrl);

// Update variables
await sigmaIntegrationService.updateVariables({
  'date_range': 'last_30_days',
  'region': 'north_america'
});

// Handle events
sigmaIntegrationService.on('workbook:loaded', (workbook) => {
  console.log('Workbook loaded:', workbook);
});
```

---

## 📡 **Event System**

### **Workbook Lifecycle Events**
```tsx
// Workbook loaded
useWorkbookLoaded(iframeRef);

// Workbook error
useWorkbookError(iframeRef);

// Data loaded
useWorkbookDataLoaded(iframeRef);
```

### **User Interaction Events**
```tsx
// Variable changes
useVariableChange(iframeRef);

// Element selection
useTableCellSelect(iframeRef);

// Action outbound
useActionOutbound(iframeRef);
```

### **Display Events**
```tsx
// Fullscreen changes
useWorkbookFullScreen(iframeRef);

// Page height changes
useWorkbookPageHeight(iframeRef);

// Node selection
useWorkbookSelectedNode(iframeRef);
```

### **Bookmark Events**
```tsx
// Bookmark creation
useWorkbookBookmarkOnCreate(iframeRef);

// Bookmark changes
useWorkbookBookmarkOnChange(iframeRef);

// Bookmark updates
useWorkbookBookmarkOnUpdate(iframeRef);

// Bookmark deletion
useWorkbookBookmarkOnDelete(iframeRef);
```

---

## 🎮 **Interactive Features**

### **Variable Management**
```tsx
// Update workbook variables
await updateWorkbookVariables(iframeRef, {
  'date_range': 'last_7_days',
  'metric': 'revenue',
  'segment': 'enterprise'
});

// Get current variables
const currentVariables = useWorkbookCurrentVariables(iframeRef);
```

### **Bookmark System**
```tsx
// Create bookmark
await createWorkbookBookmark(iframeRef, {
  name: 'Q4 Analysis',
  description: 'Q4 performance overview'
});

// Select bookmark
await selectWorkbookBookmark(iframeRef, 'bookmark-id');

// Delete bookmark
await deleteWorkbookBookmark(iframeRef, 'bookmark-id');
```

### **Display Controls**
```tsx
// Toggle fullscreen
await updateWorkbookFullscreen(iframeRef, 'node-id');

// Select specific node
await updateWorkbookSelectedNodeId(iframeRef, 'node-id', 'element');
```

---

## 🏗 **Building Sigma Data Applications**

### **1. Application Structure**
```tsx
const SigmaDataApp = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Sigma SDK hooks
  const workbookLoaded = useWorkbookLoaded(iframeRef);
  const variableChange = useVariableChange(iframeRef);
  const actionOutbound = useActionOutbound(iframeRef);
  
  // Application state
  const [appState, setAppState] = useState({});
  
  // Handle Sigma events
  useEffect(() => {
    if (workbookLoaded) {
      // Initialize application with workbook data
      initializeApp(workbookLoaded);
    }
  }, [workbookLoaded]);
  
  useEffect(() => {
    if (variableChange) {
      // Handle variable changes
      handleVariableUpdate(variableChange);
    }
  }, [variableChange]);
  
  return (
    <div>
      {/* Your application UI */}
      <SigmaWorkbookEmbed
        ref={iframeRef}
        workbookUrl={workbookUrl}
        onWorkbookLoaded={handleWorkbookLoaded}
        onVariableChange={handleVariableChange}
        onActionOutbound={handleActionOutbound}
      />
    </div>
  );
};
```

### **2. Event-Driven Architecture**
```tsx
// Centralized event handling
const eventHandlers = {
  'workbook:loaded': (event) => {
    // Initialize application
    setAppState(prev => ({
      ...prev,
      workbook: event.workbook,
      variables: event.workbook.variables
    }));
  },
  
  'workbook:variable:change': (event) => {
    // Update application state
    setAppState(prev => ({
      ...prev,
      variables: {
        ...prev.variables,
        [event.variable.name]: event.variable.value
      }
    }));
  },
  
  'workbook:action:outbound': (event) => {
    // Handle user actions
    handleUserAction(event.action);
  }
};

// Register event handlers
Object.entries(eventHandlers).forEach(([eventType, handler]) => {
  sigmaIntegrationService.on(eventType, handler);
});
```

### **3. State Synchronization**
```tsx
// Sync application state with Sigma
const syncWithSigma = async (newState) => {
  try {
    // Update Sigma variables
    await sigmaIntegrationService.updateVariables(newState.variables);
    
    // Update application state
    setAppState(newState);
    
    // Log synchronization
    console.log('State synchronized with Sigma');
  } catch (error) {
    console.error('Failed to sync with Sigma:', error);
  }
};
```

---

## 🔒 **Security & Best Practices**

### **1. Error Handling**
```tsx
// Always implement error boundaries
const handleSigmaError = (error) => {
  console.error('Sigma integration error:', error);
  
  // Show user-friendly error message
  setError({
    message: 'Failed to connect to Sigma workbook',
    details: error.message
  });
  
  // Attempt recovery
  setTimeout(() => {
    retryConnection();
  }, 5000);
};
```

### **2. Performance Optimization**
```tsx
// Debounce variable updates
const debouncedVariableUpdate = useCallback(
  debounce(async (variables) => {
    await sigmaIntegrationService.updateVariables(variables);
  }, 300),
  []
);

// Cleanup on unmount
useEffect(() => {
  return () => {
    sigmaIntegrationService.reset();
  };
}, []);
```

### **3. Type Safety**
```tsx
// Use TypeScript interfaces for Sigma events
interface SigmaWorkbookEvent {
  type: string;
  timestamp: string;
  data: any;
}

// Type-safe event handling
const handleSigmaEvent = (event: SigmaWorkbookEvent) => {
  switch (event.type) {
    case 'workbook:loaded':
      handleWorkbookLoaded(event.data);
      break;
    case 'workbook:variable:change':
      handleVariableChange(event.data);
      break;
    default:
      console.warn('Unknown Sigma event type:', event.type);
  }
};
```

---

## 🚀 **Deployment & Integration**

### **1. Export for Sigma**
Applications built in this playground can be:
- **Directly imported** into Sigma's platform
- **Deployed as embedded** applications
- **Shared** with other Sigma users

### **2. Integration Checklist**
- [ ] All Sigma events properly handled
- [ ] Variables synchronized correctly
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] TypeScript types defined
- [ ] Event logging configured

### **3. Testing in Sigma**
1. Build your application in the playground
2. Test all Sigma interactions
3. Export the application code
4. Import into Sigma's platform
5. Verify functionality in production

---

## 📚 **Additional Resources**

### **Official Documentation**
- [Sigma Embed SDK](https://github.com/sigmacomputing/embed-sdk)
- [Sigma React SDK](https://github.com/sigmacomputing/embed-sdk/tree/main/packages/react-embed-sdk)
- [Sigma Data Apps Documentation](https://help.sigmacomputing.com/hc/en-us/articles/1500002406442)

### **Examples & Templates**
- Sample applications in the playground
- Event handling patterns
- State management examples
- Performance optimization tips

### **Support**
- Use the playground's event monitoring
- Check the browser console for errors
- Review the Sigma SDK documentation
- Test with sample workbooks first

---

## 🎉 **Next Steps**

1. **Explore the Playground**: Navigate to `/sigma/playground`
2. **Load Sample Workbooks**: Test with provided examples
3. **Build Your App**: Use the Sigma SDK components
4. **Test Integration**: Verify Sigma compatibility
5. **Deploy**: Export and import into Sigma's platform

**Welcome to true Sigma compatibility! 🚀** 