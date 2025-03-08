import { useState } from 'react';
import Button from './Button';
import Statistics from './Statistics';

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral"  />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <Statistics goodTotal={good} neutralTotal={neutral} badTotal={bad} />  
    </div>
  );
}

export default App;
