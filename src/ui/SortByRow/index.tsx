import React, { ReactElement, ReactNode } from 'react';
import uuidv4 from '../../utils/uuid';

import './index.scss';

const componentClassName = 'sendbird-sort-by-row';

export interface SortByRowProps {
  className?: string | Array<string>;
  maxItemCount: number;
  itemWidth: number;
  itemHeight: number;
  children: ReactNode;
}
export default function SortByRow({
  className = '',
  maxItemCount,
  itemWidth,
  itemHeight,
  children,
}: SortByRowProps): ReactElement {
  if (Array.isArray(children) && children.length > maxItemCount) {
    const result: ReactElement[] = [];

    for (let i = 0; i < children.length; i += maxItemCount) {
      result.push(
        <div
          className={[
            ...(Array.isArray(className) ? className : [className]),
            componentClassName,
          ].join(' ')}
          key={uuidv4()}
          style={{
            width: itemWidth * maxItemCount,
            height: itemHeight,
          }}
        >
          {
            children.slice(i, i + maxItemCount)
          }
        </div>,
      );
    }
    return <>{result}</>;
  }

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        componentClassName,
      ].join(' ')}
      style={{
        width: itemWidth * (Array.isArray(children) ? children.length : 1),
        height: itemHeight,
      }}
    >
      {children as ReactElement}
    </div>
  );
}
