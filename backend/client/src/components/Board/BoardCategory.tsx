import React, { useState, useEffect } from "react";
import { Category } from "@/types/Board/category";

type BoardCategoryProps = {
	categories: Category[];
	onCategorySelect: (category: string) => void;
	selectedCategory: string;
};

function BoardCategory({
	categories,
	onCategorySelect,
	selectedCategory,
}: BoardCategoryProps) {
	const [selectedIndex, setSelectedIndex] = useState<number>(0);

	useEffect(() => {
		const index = categories.findIndex(
			(category) => category.name === selectedCategory,
		);
		if (index !== -1) {
			setSelectedIndex(index);
		}
	}, [selectedCategory, categories]);

	const handleSelect = (index: number, category: string) => {
		setSelectedIndex(index);
		onCategorySelect(category);
	};

	return (
		<div className="flex w-full relative">
			{categories.map((category, index) => (
				<React.Fragment key={category.id}>
					<input
						type="radio"
						id={`option${index}`}
						name="tabs"
						className="appearance-none"
						checked={selectedIndex === index}
						onChange={() => handleSelect(index, category.name)}
					/>
					<label
						htmlFor={`option${index}`}
						className="cursor-pointer flex-1 flex items-center justify-center truncate uppercase select-none text-lg py-2"
					>
						{category.name}
					</label>
				</React.Fragment>
			))}
			<div
				className="absolute bottom-0 h-1 bg-black transition-transform duration-300"
				style={{
					width: `calc(100% / ${categories.length})`,
					transform: `translateX(${selectedIndex * 100}%)`,
				}}
			/>
		</div>
	);
}

export default BoardCategory;
