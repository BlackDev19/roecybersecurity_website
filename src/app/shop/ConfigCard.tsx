import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Configuration } from './page'
import { animations } from './page'

interface ConfigCardProps {
  config: Configuration
  selected: boolean
  onSelect: () => void
  alreadyAdded: boolean
}

const ConfigCard = ({ config, selected, onSelect, alreadyAdded }: ConfigCardProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    whileHover={{ scale: 1.02 }}
    viewport={{ once: true }}
    variants={animations.fadeInUp}
    className={`relative bg-gray-800/60 p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 group ${
      selected
        ? 'border-blue-500 bg-blue-900/20 hover:shadow-blue-500/30'
        : 'border-gray-700 hover:border-blue-500 hover:shadow-blue-500/30'
    } shadow-xl hover:shadow-2xl`}
    onClick={onSelect}
  >
    {/* Effet de lueur bleue au survol */}
    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
    </div>

    <div className="text-center relative z-10">
      <div className="text-lg font-semibold mb-1 group-hover:text-blue-300 transition-colors duration-300">
        {config.ram}
      </div>
      <div className="text-gray-300 mb-1 group-hover:text-blue-200 transition-colors duration-300">
        {config.storage}
      </div>
      <div className="text-gray-300 mb-1 group-hover:text-blue-200 transition-colors duration-300">
        {config.cpu} - {config.generation} Gen
      </div>
      <div className="text-gray-300 mb-1 group-hover:text-blue-200 transition-colors duration-300">
        {config.gpu}
      </div>
      <div className="text-2xl font-bold text-blue-400 mb-1 group-hover:text-blue-300 transition-colors duration-300">
        ${config.price.toLocaleString()}
      </div>
      {selected && (
        <div className="mt-2 flex justify-center">
          <CheckCircle className="h-5 w-5 text-green-400 group-hover:scale-110 transition-transform duration-300" />
        </div>
      )}
      {alreadyAdded && (
        <span className="absolute top-2 right-2 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full z-20">
          Déjà ajouté
        </span>
      )}
    </div>
  </motion.div>
)

export default ConfigCard
