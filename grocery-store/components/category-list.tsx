import Link from "next/link"
import Image from "next/image"

import { categories } from "@/data/categories"

export default function CategoryList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link key={category.id} href={`/products?category=${category.id}`} className="group flex flex-col items-center">
          <div className="relative w-full aspect-square mb-2 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <Image
              src={category.image || "/placeholder.svg?height=200&width=200"}
              alt={category.name}
              width={200}
              height={200}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="text-sm font-medium text-center group-hover:text-green-600 transition-colors">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  )
}

