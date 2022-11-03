import Layout from '@/components/Layout';
import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import { Client } from '@notionhq/client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  posts: any;
};

const NewsPage: NextPage<Props> = ({ posts }) => {
  // console.log(posts);
  return (
    <Layout title="News">
      <div className="grid grid-cols-4 gap-4">
        {posts.map((el: any, index) => {
          return (
            <div key={index} className="card col-span-2 col-start-2 ">
              <Link href={`/news/${el.id}`}>
                <a>
                  <div className="flex">
                    {el.cover && (
                      <Image
                        src={el.cover.external.url}
                        width={300}
                        height={200}
                        alt=""
                      />
                    )}
                    <div>
                      <h1 className="text-2xl">
                        {el.properties.Name.title[0].plain_text}
                      </h1>
                      <span>{el.created_time}</span>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const databaseId = process.env.NOTION_DATABASE;
  const res = await notion.databases.query({
    database_id: databaseId,
  });

  return {
    props: {
      posts: res.results,
    },
  };
};

export default NewsPage;
