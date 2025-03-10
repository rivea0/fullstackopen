import Content from './Content';

const Course = ({ course }) => {
  return (
    <>
      <CourseHeader name={course.name} />
      <Content parts={course.parts} />
    </>
  );
}

const CourseHeader = ({ name }) => <h2>{name}</h2>;

export default Course;
