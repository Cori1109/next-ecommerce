import Layout from '@/components/Layout';
import { Client } from '@notionhq/client';
import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import React from 'react';
import Image from 'next/image';
import { Alert, Breadcrumb } from 'flowbite-react';

type Props = {
  post: any;
  blocks: any;
};

const NewPage: NextPage<Props> = ({ post, blocks }) => {
  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'paragraph':
        // For a paragraph
        return <p>{block['paragraph'].rich_text[0]?.text?.content} </p>;
      case 'heading_1':
        return (
          <h1 className="text-3xl m-2">
            {block['heading_1'].rich_text[0].plain_text}{' '}
          </h1>
        );
      case 'heading_2':
        return (
          <h2 className="text-2xl m-2">
            {block['heading_2'].rich_text[0].plain_text}{' '}
          </h2>
        );
      case 'heading_3':
        return (
          <h3 className="text-xl m-2">
            {block['heading_3'].rich_text[0].plain_text}{' '}
          </h3>
        );
      case 'callout':
        return (
          <Alert color="warning" className="m-2">
            <span>{block['callout'].rich_text[0].text.content}</span>
          </Alert>
        );
      case 'quote':
        return (
          <Alert color="info" className="m-2">
            <span>{block['quote'].rich_text[0].text.content}</span>
          </Alert>
        );
      case 'bulleted_list_item':
        // For an unordered list
        return <li>{block['bulleted_list_item'].rich_text[0].plain_text} </li>;
      case 'numbered_list_item':
        return (
          <ul>
            <li>{block['numbered_list_item'].rich_text[0].plain_text} </li>
          </ul>
        );
      case 'to_do':
        return (
          <li className="text-lg">{block['to_do'].rich_text[0].plain_text}</li>
        );

      case 'image':
        // For an image
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <Image
            src={`${block['image'].file.url}`}
            className="object-cover h-48 w-96"
            width="650"
            height="400"
            alt="image"
            loading="lazy"
          />
        );

      default:
        // For an extra type
        return <p>Undefined type </p>;
    }
  };

  return (
    <Layout title="New">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card md:col-span-2 md:col-start-2 p-3">
          <Breadcrumb aria-label="Default breadcrumb example">
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/news">News</Breadcrumb.Item>
            <Breadcrumb.Item>
              {post.properties.Name.title[0].plain_text}
            </Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="text-5xl">
            {post.properties.Name.title[0].plain_text}
          </h1>
          <br />
          <div>
            {blocks.map((block, index) => {
              return <div key={index}>{renderBlock(block)}</div>;
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { params } = context;
  const { id } = params;
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  const post = await notion.pages.retrieve({
    // @ts-ignore
    page_id: id,
  });
  const blocks = await notion.blocks.children.list({
    // @ts-ignore
    block_id: id,
  });

  return {
    props: {
      post: post,
      blocks: blocks.results,
    },
  };
};

export default NewPage;
