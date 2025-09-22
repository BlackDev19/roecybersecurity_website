import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Configuration } from './page'
import { animations } from './page'

interface CartItemCardProps {
  item: Configuration
  onRemove: () => void
}

const CartItemCard = ({ item, onRemove }: CartItemCardProps) => (
  <motion.li
    initial="hidden"
    whileInView="visible"
    whileHover={{ scale: 1.02 }}
    viewport={{ once: true }}
    variants={animations.fadeInUp}
    className="flex justify-between items-center bg-gray-700/60 p-4 rounded-xl cursor-pointer relative group border-2 border-transparent hover:border-blue-500 hover:shadow-blue-500/30 shadow-xl"
  >
    {/* Effet de lueur bleue au survol */}
    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
    </div>

    <div className="relative z-10">
      <p className="font-semibold group-hover:text-blue-300 transition-colors duration-300">
        {item.ram} / {item.storage} / {item.cpu} {item.generation} Gen / {item.gpu}
      </p>
      <p className="text-blue-400 font-bold group-hover:text-blue-300 transition-colors duration-300">
        ${item.price.toLocaleString()}
      </p>
    </div>
    <button
      onClick={onRemove}
      className="text-red-500 hover:text-red-400 relative z-10 group/button"
      aria-label="Retirer du panier"
    >
      <X className="h-5 w-5 group-hover/button:scale-110 transition-transform duration-300" />
    </button>
  </motion.li>
)

export default CartItemCard
