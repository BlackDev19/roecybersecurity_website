import { motion } from 'framer-motion'
import { Feature } from './page'
import { animations } from './page'

interface FeatureCardProps {
  feature: Feature
}

const FeatureCard = ({ feature }: FeatureCardProps) => {
  const Icon = feature.icon
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      whileHover={{ scale: 1.05 }}
      viewport={{ once: true }}
      variants={animations.fadeInUp}
      className="bg-gray-800/60 p-6 rounded-xl text-center transition-all duration-300 relative overflow-hidden group border-2 border-transparent hover:border-blue-500 hover:shadow-blue-500/30 shadow-xl"
    >
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
      </div>
      <Icon className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300 relative z-10" />
      <h3 className="font-semibold mb-2 group-hover:text-blue-300 transition-colors duration-300 relative z-10">
        {feature.title}
      </h3>
      <p className="text-gray-300 text-sm group-hover:text-blue-200 transition-colors duration-300 relative z-10">
        {feature.description}
      </p>
    </motion.div>
  )
}

export default FeatureCard
