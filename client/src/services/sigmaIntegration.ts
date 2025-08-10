import { 
  useSigmaIframe,
  useWorkbookLoaded,
  useWorkbookError,
  useWorkbookDataLoaded,
  useVariableChange,
  useTableCellSelect,
  useWorkbookPublished,
  useWorkbookFullScreen,
  useWorkbookPageHeight,
  useWorkbookSelectedNode,
  useWorkbookPivotTableCellSelect,
  useWorkbookChartValueSelect,
  useWorkbookCurrentVariables,
  useWorkbookBookmarkOnCreate,
  useWorkbookBookmarkOnChange,
  useWorkbookBookmarkOnUpdate,
  useWorkbookBookmarkOnDelete,
  useActionOutbound,
  updateWorkbookVariables,
  createWorkbookBookmark,
  updateWorkbookBookmark,
  deleteWorkbookBookmark,
  selectWorkbookBookmark,
  updateWorkbookFullscreen,
  updateWorkbookSelectedNodeId,
  updateWorkbookSharingLink
} from '@sigmacomputing/react-embed-sdk';

import type {
  WorkbookLoadedEvent,
  WorkbookErrorEvent,
  WorkbookDataLoadedEvent,
  WorkbookVariableOnChangeEvent,
  WorkbookTableCellSelectEvent,
  WorkbookPublishedEvent,
  WorkbookFullScreenEvent,
  WorkbookPageHeightEvent,
  WorkbookChartValueSelectEvent,
  WorkbookSelectedNodeEvent,
  WorkbookPivotTableCellSelectEvent,
  WorkbookCurrentVariablesEvent,
  WorkbookChartErrorEvent,
  WorkbookExploreKeyOnChangeEvent,
  WorkbookBookmarkOnChangeEvent,
  UrlOnChangeEvent,
  WorkbookIdOnChangeEvent,
  WorkbookBookmarkOnCreateEvent,
  ActionOutboundEvent,
  WorkbookBookmarkOnUpdateEvent,
  WorkbookBookmarkOnDeleteEvent,
  WorkbookBookmarkCreateEvent
} from '@sigmacomputing/embed-sdk';

/**
 * Sigma Integration Service
 * 
 * This service provides a comprehensive interface for integrating with Sigma's platform
 * using the official React SDK. It handles workbook lifecycle, events, and interactions.
 */
export class SigmaIntegrationService {
  private iframeRef: React.RefObject<HTMLIFrameElement> | null = null;
  private eventHandlers: Map<string, Function> = new Map();
  private workbookState: any = null;
  private isInitialized: boolean = false;

  constructor() {
    this.setupEventHandlers();
  }

  /**
   * Set the iframe reference for Sigma communication
   */
  setIframeRef(iframeRef: React.RefObject<HTMLIFrameElement>) {
    this.iframeRef = iframeRef;
  }

  /**
   * Initialize the Sigma integration
   */
  async initialize(workbookUrl: string): Promise<void> {
    if (!this.iframeRef?.current) {
      throw new Error('Iframe reference not set');
    }

    try {
      // Set the iframe source to load the Sigma workbook
      if (this.iframeRef.current) {
        this.iframeRef.current.src = workbookUrl;
      }
      
      this.isInitialized = true;
      console.log('Sigma integration initialized with workbook:', workbookUrl);
    } catch (error) {
      console.error('Failed to initialize Sigma integration:', error);
      throw error;
    }
  }

  /**
   * Setup default event handlers
   */
  private setupEventHandlers() {
    // Workbook lifecycle events
    this.eventHandlers.set('workbook:loaded', this.handleWorkbookLoaded.bind(this));
    this.eventHandlers.set('workbook:error', this.handleWorkbookError.bind(this));
    this.eventHandlers.set('workbook:data:loaded', this.handleDataLoaded.bind(this));
    
    // User interaction events
    this.eventHandlers.set('workbook:variable:change', this.handleVariableChange.bind(this));
    this.eventHandlers.set('workbook:element:select', this.handleElementSelect.bind(this));
    this.eventHandlers.set('workbook:action:outbound', this.handleActionOutbound.bind(this));
    
    // Display events
    this.eventHandlers.set('workbook:fullscreen', this.handleFullscreen.bind(this));
    this.eventHandlers.set('workbook:page:height', this.handlePageHeight.bind(this));
    
    // Bookmark events
    this.eventHandlers.set('workbook:bookmark:create', this.handleBookmarkCreate.bind(this));
    this.eventHandlers.set('workbook:bookmark:change', this.handleBookmarkChange.bind(this));
    this.eventHandlers.set('workbook:bookmark:update', this.handleBookmarkUpdate.bind(this));
    this.eventHandlers.set('workbook:bookmark:delete', this.handleBookmarkDelete.bind(this));
  }

  /**
   * Register a custom event handler
   */
  on(eventType: string, handler: Function): void {
    this.eventHandlers.set(eventType, handler);
  }

  /**
   * Remove an event handler
   */
  off(eventType: string): void {
    this.eventHandlers.delete(eventType);
  }

  /**
   * Trigger an event with data
   */
  emit(eventType: string, data: any): void {
    const handler = this.eventHandlers.get(eventType);
    if (handler) {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
      }
    }
  }

  /**
   * Get current workbook state
   */
  getWorkbookState(): any {
    return this.workbookState;
  }

  /**
   * Check if integration is initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.iframeRef?.current !== null;
  }

  // Event Handler Methods
  private handleWorkbookLoaded(event: WorkbookLoadedEvent): void {
    console.log('Sigma workbook loaded:', event);
    this.workbookState = {
      ...this.workbookState,
      loaded: true,
      workbook: event.workbook,
      variables: event.workbook.variables
    };
    this.emit('workbook:loaded', event);
  }

  private handleWorkbookError(event: WorkbookErrorEvent): void {
    console.error('Sigma workbook error:', event);
    this.workbookState = {
      ...this.workbookState,
      error: event,
      loaded: false
    };
    this.emit('workbook:error', event);
  }

  private handleDataLoaded(event: WorkbookDataLoadedEvent): void {
    console.log('Sigma data loaded:', event);
    this.workbookState = {
      ...this.workbookState,
      dataLoaded: true,
      data: event.data
    };
    this.emit('workbook:data:loaded', event);
  }

  private handleVariableChange(event: WorkbookVariableOnChangeEvent): void {
    console.log('Sigma variable changed:', event);
    this.workbookState = {
      ...this.workbookState,
      variables: {
        ...this.workbookState.variables,
        [event.variable.name]: event.variable.value
      }
    };
    this.emit('workbook:variable:change', event);
  }

  private handleElementSelect(event: WorkbookTableCellSelectEvent | WorkbookSelectedNodeEvent): void {
    console.log('Sigma element selected:', event);
    this.workbookState = {
      ...this.workbookState,
      selectedElement: event
    };
    this.emit('workbook:element:select', event);
  }

  private handleActionOutbound(event: ActionOutboundEvent): void {
    console.log('Sigma action outbound:', event);
    this.emit('workbook:action:outbound', event);
  }

  private handleFullscreen(event: WorkbookFullScreenEvent): void {
    console.log('Sigma fullscreen changed:', event);
    this.workbookState = {
      ...this.workbookState,
      fullscreen: event.fullscreen
    };
    this.emit('workbook:fullscreen', event);
  }

  private handlePageHeight(event: WorkbookPageHeightEvent): void {
    console.log('Sigma page height changed:', event);
    this.workbookState = {
      ...this.workbookState,
      pageHeight: event.height
    };
    this.emit('workbook:page:height', event);
  }

  private handleBookmarkCreate(event: WorkbookBookmarkOnCreateEvent): void {
    console.log('Sigma bookmark created:', event);
    this.emit('workbook:bookmark:create', event);
  }

  private handleBookmarkChange(event: WorkbookBookmarkOnChangeEvent): void {
    console.log('Sigma bookmark changed:', event);
    this.emit('workbook:bookmark:change', event);
  }

  private handleBookmarkUpdate(event: WorkbookBookmarkOnUpdateEvent): void {
    console.log('Sigma bookmark updated:', event);
    this.emit('workbook:bookmark:update', event);
  }

  private handleBookmarkDelete(event: WorkbookBookmarkOnDeleteEvent): void {
    console.log('Sigma bookmark deleted:', event);
    this.emit('workbook:bookmark:delete', event);
  }

  // Workbook Control Methods
  async updateVariables(variables: Record<string, string>): Promise<void> {
    if (!this.iframeRef?.current) {
      throw new Error('Iframe not available');
    }
    
    try {
      updateWorkbookVariables(this.iframeRef, variables);
      console.log('Variables updated:', variables);
    } catch (error) {
      console.error('Failed to update variables:', error);
      throw error;
    }
  }

  async createBookmark(bookmark: WorkbookBookmarkCreateEvent): Promise<void> {
    if (!this.iframeRef?.current) {
      throw new Error('Iframe not available');
    }
    
    try {
      createWorkbookBookmark(this.iframeRef, bookmark);
      console.log('Bookmark created:', bookmark);
    } catch (error) {
      console.error('Failed to create bookmark:', error);
      throw error;
    }
  }

  async updateBookmark(): Promise<void> {
    if (!this.iframeRef?.current) {
      throw new Error('Iframe not available');
    }
    
    try {
      updateWorkbookBookmark(this.iframeRef);
      console.log('Bookmark updated');
    } catch (error) {
      console.error('Failed to update bookmark:', error);
      throw error;
    }
  }

  async deleteBookmark(bookmarkId: string): Promise<void> {
    if (!this.iframeRef?.current) {
      throw new Error('Iframe not available');
    }
    
    try {
      deleteWorkbookBookmark(this.iframeRef, bookmarkId);
      console.log('Bookmark deleted:', bookmarkId);
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
      throw error;
    }
  }

  async selectBookmark(bookmarkId?: string): Promise<void> {
    if (!this.iframeRef?.current) {
      throw new Error('Iframe not available');
    }
    
    try {
      selectWorkbookBookmark(this.iframeRef, bookmarkId);
      console.log('Bookmark selected:', bookmarkId);
    } catch (error) {
      console.error('Failed to select bookmark:', error);
      throw error;
    }
  }

  async setFullscreen(nodeId: string | null): Promise<void> {
    if (!this.iframeRef?.current) {
      throw new Error('Iframe not available');
    }
    
    try {
      updateWorkbookFullscreen(this.iframeRef, nodeId);
      console.log('Fullscreen set for node:', nodeId);
    } catch (error) {
      console.error('Failed to set fullscreen:', error);
      throw error;
    }
  }

  async selectNode(nodeId: string, nodeType: 'element' | 'page'): Promise<void> {
    if (!this.iframeRef?.current) {
      throw new Error('Iframe not available');
    }
    
    try {
      updateWorkbookSelectedNodeId(this.iframeRef, nodeId, nodeType);
      console.log('Node selected:', { nodeId, nodeType });
    } catch (error) {
      console.error('Failed to select node:', error);
      throw error;
    }
  }

  async updateSharingLink(sharingLink: string | null, sharingExplorationLink?: string | null): Promise<void> {
    if (!this.iframeRef?.current) {
      throw new Error('Iframe not available');
    }
    
    try {
      updateWorkbookSharingLink(this.iframeRef, sharingLink, sharingExplorationLink);
      console.log('Sharing link updated:', { sharingLink, sharingExplorationLink });
    } catch (error) {
      console.error('Failed to update sharing link:', error);
      throw error;
    }
  }

  /**
   * Get current variables from workbook
   */
  getCurrentVariables(): Record<string, string> | undefined {
    return this.workbookState?.variables;
  }

  /**
   * Get workbook metadata
   */
  getWorkbookMetadata(): any {
    return this.workbookState?.workbook;
  }

  /**
   * Check if workbook is loaded
   */
  isWorkbookLoaded(): boolean {
    return this.workbookState?.loaded === true;
  }

  /**
   * Check if data is loaded
   */
  isDataLoaded(): boolean {
    return this.workbookState?.dataLoaded === true;
  }

  /**
   * Get current error state
   */
  getError(): any {
    return this.workbookState?.error;
  }

  /**
   * Clear error state
   */
  clearError(): void {
    if (this.workbookState?.error) {
      this.workbookState.error = null;
    }
  }

  /**
   * Reset the integration service
   */
  reset(): void {
    this.iframeRef = null;
    this.eventHandlers.clear();
    this.workbookState = null;
    this.isInitialized = false;
    this.setupEventHandlers();
  }
}

// Export a singleton instance
export const sigmaIntegrationService = new SigmaIntegrationService();

// Export the service class for custom instances
export default SigmaIntegrationService; 