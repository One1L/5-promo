import React, { useRef } from 'react';
import copyPath from './res/copy.svg';
import classes from './styles.module.scss';

const PromoCode = ({ promocode }) => {
  const promocodeValueRef = useRef();
  return <div className={classes['promo-code']}>
    <div className={classes['promo-code__title']}>Ваш промокод</div>
    <div>
      <span ref={promocodeValueRef} className={classes['promo-code__code']}>{promocode}</span>
      <img className={classes['promo-code__copy']}
        src={copyPath}
        onClick={() => navigator.clipboard.writeText('foo')}
      />
    </div>
  </div>;
};

export default PromoCode;