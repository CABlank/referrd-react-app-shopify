### Design Document for the Support Folder

#### Overview:

The Support folder is part of the features/Brand module and contains components, hooks, and utilities related to managing and displaying customer support functionalities. This includes support query submissions, detailed views of individual support cases, and message interactions.

#### Structure:

The Support folder is structured as follows:

- **components**: Contains React components that are utilized within the support pages.
  - `QueryForm.tsx`: Component for rendering the form used to submit new support queries.
  - `QueryList.tsx`: Component for displaying a list of support queries.
  - `SupportMessageList.tsx`: Component for displaying a list of messages related to a specific support query.
  - `QuestionItem.tsx`: A sub-component used within `QueryList` to display individual queries.
- **hooks**: Contains custom React hooks for managing the logic of support queries and support details.
  - `useSupport.tsx`: A custom hook for handling support query-related operations, such as loading queries, submitting new queries, and managing the state.
  - `useSupportDetail.tsx`: A custom hook for handling the details of a specific support query, including loading the query, submitting new messages, and updating the query status.
- **SupportIndex.tsx**: The main component that provides an interface for users to submit new support queries and view a list of existing queries.
- **SupportDetail.tsx**: The component that provides an interface for viewing and interacting with the details of a specific support query.

#### Components:

1. **SupportIndex.tsx**:
   - **Description**: This component is the entry point for users to manage their support queries. It includes the form for submitting new queries and a list of existing queries.
   - **Props**:
     - `accessToken`, `refreshToken`, `userId`: Optional props used for user authentication and session management.
   - **Hooks Used**:
     - `useSupport`: Manages the state and operations related to support queries.
   - **Subcomponents**:
     - `QueryForm`: Handles the input fields for submitting a new query.
     - `QueryList`: Displays the list of queries with options to select and view details.
   - **Logic**:
     - Uses `useSupport` to manage loading, error handling, and submitting queries.
     - Renders a form for submitting new queries and a list of queries.
2. **SupportDetail.tsx**:

   - **Description**: This component is used to view the details of a specific support query and interact with the query by submitting new messages.
   - **Hooks Used**:
     - `useSupportDetail`: Manages the state and operations related to a specific support query, including loading the query, submitting responses, and updating the query status.
     - `useRouter`: Utilized for routing and extracting query parameters.
   - **Subcomponents**:
     - `SupportMessageList`: Displays the messages related to the support query.
   - **Logic**:
     - Fetches the support query details and responses using `useSupportDetail`.
     - Displays a breadcrumb-like navigation for the support detail.
     - Allows users to submit new messages related to the query.

3. **QueryForm.tsx**:

   - **Description**: A form component that allows users to enter the title, topic, and question for a new support query.
   - **Props**:
     - `queryTitle`, `question`, `topic`: Form field values.
     - `handleChange`: Function to handle form input changes.
     - `handleSubmit`: Function to submit the form.
   - **Logic**:
     - Handles user input and triggers the `handleSubmit` function when the form is submitted.

4. **QueryList.tsx**:

   - **Description**: A component that displays a list of existing support queries.
   - **Props**:
     - `queries`, `loading`, `error`: State values related to the list of queries.
     - `handleQuerySelect`: Function to handle the selection of a query.
   - **Subcomponents**:
     - `QuestionItem`: Displays individual query information.
   - **Logic**:
     - Displays loading, error, or the list of queries based on the state.
     - Triggers the `handleQuerySelect` function when a query is clicked.

5. **SupportMessageList.tsx**:

   - **Description**: Displays a list of messages related to a support query, distinguishing between messages sent by the user and others.
   - **Props**:
     - `messages`, `currentUser`: Array of messages and the current user's information.
   - **Logic**:
     - Iterates through messages, rendering them with different styles based on the sender.

6. **QuestionItem.tsx**:
   - **Description**: A sub-component used within `QueryList` to render individual query information.
   - **Props**:
     - `title`, `question`, `topic`, `status`: Information related to the query.
   - **Logic**:
     - Displays query information in a structured layout.

#### Hooks:

1. **useSupport.tsx**:

   - **Description**: Manages the state and operations for support queries, such as loading queries, submitting new queries, and handling form input.
   - **State**:
     - Includes fields like `queries`, `query`, `responses`, `loading`, `error`, `newMessage`, `queryTitle`, `question`, and `topic`.
   - **Methods**:
     - `handleChange`: Updates form fields.
     - `handleSubmit`: Submits a new support query.
     - `handleNewMessageSubmit`: Submits a new message related to a support query.
     - `handleStatusChange`: Updates the status of a support query.
     - `handleQuerySelect`: Handles query selection and navigation.

2. **useSupportDetail.tsx**:
   - **Description**: Manages the state and operations for a specific support query, including loading the query, submitting new messages, and updating the query status.
   - **State**:
     - Includes fields like `query`, `responses`, `loading`, `error`, and `newMessage`.
   - **Methods**:
     - `handleNewMessageChange`: Updates the message input field.
     - `handleNewMessageSubmit`: Submits a new message.
     - `handleStatusChange`: Updates the status of the query.
     - `combinedMessages`: Combines query and response messages for display.

#### Summary:

The Support folder encapsulates the entire flow of managing customer support within the application. It handles the submission of support queries, listing and viewing details of existing queries, and interacting with support via messages. The components are designed to be modular and reusable, with hooks providing the necessary logic to manage state and side effects. The folder is structured to separate concerns effectively, ensuring that each component and hook has a clear responsibility.
