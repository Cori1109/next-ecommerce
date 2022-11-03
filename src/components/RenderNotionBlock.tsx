import { Client } from '@notionhq/client';
import { GetServerSideProps } from 'next';
import React from 'react';

const RenderNotionBlock = (block: any) => {
  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'paragraph':
        // For a paragraph
        return <p>{block['paragraph'].rich_text[0]?.text?.content} </p>;
      case 'heading_1':
        // For a heading
        return <h1>{block['heading_1'].rich_text[0].plain_text} </h1>;
      case 'heading_2':
        // For a heading
        return <h2>{block['heading_2'].rich_text[0].plain_text} </h2>;
      case 'heading_3':
        return <h3>{block['heading_3'].rich_text[0].plain_text} </h3>;
      case 'callout':
        return <p>{block['callout'].rich_text[0].plain_text}</p>;
      case 'image':
        // For an image
        return (
          <img src={block['image'].file.url} width={650} height={400} alt="" />
        );
      case 'quote':
        return <div>Quote</div>;
      case 'bulleted_list_item':
        // For an unordered list
        return <li>{block['bulleted_list_item'].rich_text[0].plain_text} </li>;
      case 'to_do':
        return (
          <li className="text-lg">{block['to_do'].rich_text[0].plain_text}</li>
        );
      case 'numbered_list_item':
        return (
          <ul>
            <li>{block['numbered_list_item'].rich_text[0].plain_text} </li>
          </ul>
        );

      default:
        // For an extra type
        return <p>Undefined type </p>;
    }
  };

  return <div>{renderBlock(block)}</div>;
};

export default RenderNotionBlock;
