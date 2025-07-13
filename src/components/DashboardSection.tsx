
import { motion } from "framer-motion";

const DashboardSection = () => {
  return (
    <section className="w-full py-12 px-6 relative overflow-visible">
      <div className="max-w-screen-xl mx-auto">
        {/* Gradient background image */}
        <div 
          className="absolute inset-0 w-full h-full -mb-[200px]"
          style={{
            backgroundImage: 'url(/images/a6d750ce-ddca-401d-8a91-2077ddd4bb92.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        <div className="relative">
          <div className="text-center mb-8">
            <motion.p 
              className="text-lg text-[#a1a1aa] max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              Kompletan pregled rada ordinacije, u realnom vremenu.
            </motion.p>
          </div>
          <div className="bg-[#1a1a1a] shadow-2xl overflow-hidden border border-[#262626] rounded-3xl">
            <img 
              alt="Odontoa dashboard pregled ordinacije u realnom vremenu" 
              className="w-full h-auto object-cover object-top" 
              src="/images/odontoa dashboard.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
