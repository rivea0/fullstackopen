const Content = ({ parts }) => {
  return (
    <>
      <div>
        {parts.map(part => {
          return <Part key={part.id} name={part.name} exercises={part.exercises} />;
        })}
      </div>
      <Total numberOfExercises={parts.reduce((acc, part) => acc + part.exercises, 0)} />
    </>
  );
}

const Part = ({ name, exercises }) => {
  return <p>{name} {exercises}</p>;
}

const Total = ({ numberOfExercises }) => {
  return <b>total of {numberOfExercises} exercises</b>;
}

export default Content;
