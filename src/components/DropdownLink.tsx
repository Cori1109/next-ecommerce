import React from 'react';
import Link from 'next/link';

const DropdownLink = (props: any) => {
  let { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  );
};

export default DropdownLink;
