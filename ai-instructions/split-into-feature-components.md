### Split into Features/Components

1. **Identify Distinct Features**: Break down the application into distinct features or components. Each feature should represent a specific functionality or a part of the user interface.

2. **Create Component Structure**: For each identified feature, create a corresponding component structure. This typically involves creating a new directory for the component, along with its associated files (e.g., TypeScript/JavaScript files, CSS/SCSS files, test files).

3. **Implement Component Logic**: Move the relevant code from the monolithic application into the new component.
4. **Define Component Interfaces**: Clearly define the input and output interfaces for each component. This helps in maintaining a clean separation of concerns and makes it easier to integrate components later.

5. **Integrate Components**: Replace the old monolithic code with the new component-based structure. This may involve updating routes, modifying service calls, and ensuring that the overall application flow remains intact.

6. **Test Components**: Write unit tests for each component to ensure that they work as expected in isolation. This is crucial for maintaining code quality and facilitating future changes.

7. **Document Components**: Update the documentation to reflect the new component structure. This includes:
    - Component usage examples
    - API documentation for component interfaces
    - Any relevant design decisions or patterns used
8. **Folders**: Each feature should have its own folder containing all related components, styles, and tests. This keeps the project organized and makes it easier to locate files.

By following these steps, you can effectively split a monolithic application into smaller, more manageable features or components, making it easier to develop, test, and maintain over time.

**Generic Components (Shared/Reusable)**
- **DataTable**: Sortable, filterable table component with pagination
- **StatusIndicator**: Color-coded status badges with customizable states
- **ChartContainer**: Base chart wrapper with common chart functionalities
- **Modal**: Reusable modal dialog with various sizes and actions
- **FormInput**: Standard form input components with validation
- **LoadingSpinner**: Animated loading states for async operations
- **NotificationToast**: Toast notifications for user feedback
- **SearchBar**: Search input with debouncing and filtering capabilities
- **DateTimePicker**: Date/time selection component
- **ConfirmationDialog**: Yes/No confirmation dialogs for destructive actions



**Implementation Hierarchy**
1. **Generic Components First**: Build foundation components that can be reused across features
2. **Feature Components Second**: Implement domain-specific components using generic components as building blocks
3. **Page Composition**: Combine feature components to create complete page layouts
4. **Cross-Component Communication**: Use props, events, and state management for component interaction
# Split into feature components

## Guideline
Use the components exemplified below to split the application into feature components. Each feature should have its own set of components that encapsulate the functionality related to that feature but don't limit yourself to these examples.
Analyze the "components" folder in the project structure to not create duplicates.
Shared components should placed in "components" folder and feature-specific components should be placed in their respective feature folders.
Use the name convention that i told you before, e.g. ops_operation-thumbnail.tsx for a component that displays an operation thumbnail in the Operations feature.
## Generic components

- <Sidebar />
- <TopBar />
- <NotificationsDropdown />
- <PageTitle />
- <PageSubtite />

## Feature components

### Feature: Command Center

- <CmdChatActivity />
-

### Feature: Agents

- <AgentTable /> 
- <AgentSearch />
- <AgentStats />
- <AgentForm />
- <AgentFormAdd />
- <AgentFormEdit />
- <AgentDetails />
- <AgentAllocation />
- <AgentActivityLog />

### Feature: Operations

- <OpsStats />
- <OpsOperationThumbnail />
- <OpsOperationDetails />
- <OpsMissionsOverviewChart />
- <OpsMissionsStats />

### Feature: Intelligence

- <IntSearch />
- <IntStats />
- <IntReportThumbnail />
- <IntReportSummary />
- <IntReportDetails />

### Feature: Systems

- <SysStats />
- <SysLogs />
- <SysSystemThumbnail />
- <SysSystemDetails />
