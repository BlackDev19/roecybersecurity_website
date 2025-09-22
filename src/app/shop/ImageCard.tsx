import { motion } from 'framer-motion'
import Image from 'next/image'
import { animations } from './page'

interface ImageCardProps {
  src: string
  alt: string
}

const ImageCard = ({ src, alt }: ImageCardProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    whileHover={{ scale: 1.05 }}
    viewport={{ once: true }}
    variants={animations.fadeInUp}
    className="relative w-full h-64 rounded-2xl overflow-hidden bg-gray-800/60 cursor-pointer group border-2 border-transparent hover:border-blue-500 hover:shadow-blue-500/30 shadow-xl"
  >
    <Image src={src} alt={alt} fill className="object-contain rounded-xl" />
    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
    </div>
  </motion.div>
)

export default ImageCard
