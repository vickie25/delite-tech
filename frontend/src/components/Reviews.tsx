import React from 'react';

const reviews = [
  { name: 'Sandra Cook', date: '5 Days ago', text: 'Well, this was simply amazing. Service! They have some great people there, and I mean above the expectations.', rating: 5, img: 'https://i.pravatar.cc/150?u=sandra' },
  { name: 'Francine Mossy', date: '2 Days ago', text: 'This site is helpful with networking and simply I am getting resume reviews weekly. overall, benefits a great amazing and legitimate job search.', rating: 5, img: 'https://i.pravatar.cc/150?u=francine' },
  { name: 'Amanda Adams', date: '1 Month ago', text: 'I have an account and have been a member for about five years. It is unique to find places that are looking for you to join their team.', rating: 4, img: 'https://i.pravatar.cc/150?u=amanda' },
];

const Reviews = () => {
  return (
    <section className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12">Popular Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-surface/50 p-8 rounded-3xl space-y-4 border border-primary/5 hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <img src={rev.img} alt={rev.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h4 className="font-bold text-sm">{rev.name}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{rev.date}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <i key={j} className={`fa-solid fa-star text-[10px] ${j < rev.rating ? 'text-primary' : 'text-gray-200'}`}></i>
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">"{rev.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
