"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

interface WalletOptionProps {
    id: string
    name: string
    icon: string
}

interface WalletSelectorProps {
    options: WalletOptionProps[]
    selectedWallet: string
    onSelect: (walletId: string) => void
}

export function WalletSelector({ options, selectedWallet, onSelect }: WalletSelectorProps) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {options.map((wallet) => (
                <WalletOption
                    key={wallet.id}
                    wallet={wallet}
                    isSelected={selectedWallet === wallet.id}
                    onSelect={() => onSelect(wallet.id)}
                />
            ))}
        </div>
    )
}

export function WalletOption({
    wallet,
    isSelected,
    onSelect,
}: { wallet: WalletOptionProps; isSelected: boolean; onSelect: () => void }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            className={`relative flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${isSelected
                    ? "bg-blue-500/20 border-2 border-blue-500"
                    : "bg-white/5 border-2 border-transparent hover:border-blue-500/50"
                }`}
            onClick={onSelect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="relative w-16 h-16 mb-3">
                <Image
                    src={wallet.icon}
                    alt={wallet.name}
                    layout="fill"
                    objectFit="contain"
                    className="transition-opacity duration-300"
                    style={{ opacity: isSelected || isHovered ? 1 : 0.7 }}
                />
            </div>
            <span className={`text-sm font-medium ${isSelected ? "text-blue-400" : "text-gray-300"}`}>{wallet.name}</span>
            {isSelected && (
                <motion.div
                    className="absolute top-2 right-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                </motion.div>
            )}
        </motion.div>
    )
}

