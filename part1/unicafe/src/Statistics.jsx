import StatisticLine from './StatisticLine';

const Statistics = ({ goodTotal, neutralTotal, badTotal }) => {
  const total = goodTotal + neutralTotal + badTotal;

  if (total === 0) {
    return (
      <>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </>
    );
  }

  const SCORES = { good: 1, neutral: 0, bad: -1 };

  const calculateScores = () => {
    return (goodTotal * SCORES.good) + (neutralTotal * SCORES.neutral) + (badTotal * SCORES.bad);
  }

  const calculateAverage = () => {
    return calculateScores() / total;
  }

  const calculatePositivePercentage = () => {
    return (goodTotal / total) * 100;
  }

  const average = calculateAverage();
  const positivePercentage = calculatePositivePercentage();

  return (
    <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <tr>
            <StatisticLine text="good" value={goodTotal} />
          </tr>
          <tr>
            <StatisticLine text="neutral" value={neutralTotal} />
          </tr>
          <tr>
            <StatisticLine text="bad" value={badTotal} />
          </tr>
          <tr>
            <StatisticLine text="all" value={total} />
          </tr>
          <tr>
            <StatisticLine text="average" value={average} />
          </tr>
          <tr>
            <StatisticLine text="positive" value={`${positivePercentage}%`} />
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default Statistics;
