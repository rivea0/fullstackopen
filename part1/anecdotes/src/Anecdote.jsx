const Anecdote = ({ headerText, anecdote, numberOfVotes }) => {
  return (
    <>
      <h1>{headerText}</h1>
      <p>{anecdote}</p>
      <p>has {numberOfVotes} votes</p>
    </>
  );
}

export default Anecdote;
