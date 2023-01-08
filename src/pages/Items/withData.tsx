import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const getPlans = () =>
  Promise.all([
    fetch('/assets/asset-plan.json').then((d) => d.json()),
    fetch('/assets/hyperlinks.json').then((d) => d.json()),
  ]);

const withData =
  (Component, planOnly: boolean = false) =>
  (props) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const params = useParams();

    useEffect(() => {
      setLoading(true);
      if (planOnly) {
        getPlans()
          .then(([plan, hyperlinks]) => setData({ plan, hyperlinks }))
          .then(() => setLoading(false));
      } else {
        fetch(`/assets/movement.${params.week}.${params.item}.json`)
          .then((d) => d.json())
          .then((d) => setData(d))
          .then(() => setLoading(false));
      }
    }, [params]);

    return <Component {...props} loading={loading} data={data} />;
  };

export default withData;
