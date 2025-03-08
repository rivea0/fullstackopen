import { useState } from 'react';
import Button from './Button';
import Anecdote from './Anecdote';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const getRandomArrayIndex = (arrayLength) => Math.floor(Math.random() * arrayLength);
  const mostVotesIndex = votes.indexOf(Math.max(...votes));

  const handleNextQuoteClick = () => {
    setSelected(getRandomArrayIndex(anecdotes.length));
  }

  const handleVoteClick = () => {
    const copiedVotes = [...votes];
    copiedVotes[selected] += 1;
    setVotes(copiedVotes);
    // or:
    // const updatedVotes = votes.map((item, idx) => (selected === idx) ? item + 1 : item);
    // setVotes(updatedVotes);
  }

  return (
    <div>
      <Anecdote
        headerText="Anecdote of the day"
        anecdote={anecdotes[selected]}
        numberOfVotes={votes[selected]}
      />
      <Button onClick={handleVoteClick} text="vote" />
      <Button onClick={handleNextQuoteClick} text="next anecdote" />
      {
        // Display info text when there is no highest voted anecdote
        votes.every(vote => vote === 0) ?
          <>
            <h1>Anecdote with most votes</h1>
            <p>None of the anecdotes have received any votes so far!</p>
          </> :
          <Anecdote
            headerText="Anecdote with most votes"
            anecdote={anecdotes[mostVotesIndex]}
            numberOfVotes={votes[mostVotesIndex]}
          />
      }
    </div>
  );
}

export default App;
