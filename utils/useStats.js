import { useState, useEffect } from 'react';

export default function useStats(url) {
  const [stats, setStats] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  console.log(typeof stats);//object
  console.log(typeof setStats);//function
  console.log(typeof loading);//boolean
  console.log(typeof setLoading);// function
  console.log(typeof error);//undefined
  console.log(typeof setError);//function
  useEffect(() => {
    console.log('Mounting or updating');
    async function fetchData() {
      setLoading(true);
      setError();
      console.log('Fetching Data');
      console.log(typeof(url));
      const data = await fetch(url)
        .then(res => res.json())
        .catch(err => {
          setError(err);
        });
      setStats(data);
      setLoading(false);
      console.log(typeof(data));//object
    }
    fetchData();
  }, [url]);
  return {
    stats,
    loading,
    error,
  };
}
