'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Home2BlogSection = () => {
  const blogPosts = [
    {
      title: 'The Dos and Don\'ts of Teeth Whitening: Expert Advice',
      excerpt: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque...',
      category: 'Tips',
      image: '📷'
    },
    {
      title: 'Oral Health for All Ages: Tips for Kids, Teens, and Adults',
      excerpt: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque...',
      category: 'Health',
      image: '📷'
    },
    {
      title: 'Understanding Root Canal Treatment: What to Expect',
      excerpt: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque...',
      category: 'Treatment',
      image: '📷'
    }
  ];

  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto max-w-[1240px] px-[10px]">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <div 
              className="inline-flex items-center gap-[0.97px] border rounded-[4px]"
              style={{
                padding: '6px 15.81px 7.39px 16.97px',
                borderColor: '#EEEEEE',
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '1.6em',
                color: '#3267FF'
              }}
            >
              Our Blogs
            </div>
          </div>
          <h2
            className="text-[#000A2D] mb-4"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 800,
              fontSize: '52px',
              lineHeight: '1.1em',
              letterSpacing: '-2.88%'
            }}
          >
            Blogs & News
          </h2>
          <p
            className="text-[#636571] max-w-2xl mx-auto"
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '1.6em'
            }}
          >
            Stay updated with the latest dental health tips and news from our expert team.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="bg-white border border-[#EEEEEE] rounded-[4px] overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative w-full h-[200px] bg-gray-100 flex items-center justify-center">
                <span className="text-4xl">{post.image}</span>
                <div 
                  className="absolute top-0 right-0 bg-[#3267FF] text-white px-3 py-1 rounded-bl-[4px]"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 700,
                    fontSize: '15px',
                    lineHeight: '1em',
                    letterSpacing: '3.2%'
                  }}
                >
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="text-[#000A2D] mb-3"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 700,
                    fontSize: '22px',
                    lineHeight: '1.2em'
                  }}
                >
                  {post.title}
                </h3>
                <p
                  className="text-[#636571] mb-4"
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '1.6em'
                  }}
                >
                  {post.excerpt}
                </p>
                <Button
                  variant="pillSecondary"
                  size="pill"
                  className="gap-2"
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home2BlogSection;





