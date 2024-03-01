function App() {
  const { useState, useEffect } = React;
  const [trigger, setTrigger] = useState(0); // Add a trigger for re-fetching data

  const [{ data, isLoading, isError }, fetchData] = useDataApi(
    'http://www.boredapi.com/api/activity/', // Initial URL
    {}, // Initial data
    trigger // Pass trigger as a dependency to re-fetch
  );

  return (
    <div>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : isError ? (
        <div>Error fetching data.</div>
      ) : (
        <div className="activity-container">
          <h3>Random Activity to Overcome Boredom:</h3>
          <p><strong>Activity:</strong> {data.activity}</p>
          <p><strong>Type:</strong> {data.type}</p>
          <p><strong>Participants:</strong> {data.participants}</p>
          <p><strong>Price:</strong> {data.price}</p>
          <p><strong>Link:</strong> <a href={data.link} target="_blank" rel="noopener noreferrer">{data.link}</a></p>
        </div>
      )}
      <button className="btn btn-primary" onClick={() => setTrigger(prev => prev + 1)}>Find another activity</button>
    </div>
  );
}

const useDataApi = (initialUrl, initialData, trigger) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await axios(url);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE' });
      }
    };

    fetchData();
  }, [url, trigger]); // Include trigger in the dependency array

  return [state, setUrl];
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

// ========================================
ReactDOM.render(<App />, document.getElementById('root'));
