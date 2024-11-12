const bentoSections = document.querySelectorAll('.bento-section');
const ingredients = document.querySelectorAll('.ingredient');
const createDishBtn = document.getElementById('create-dish-btn');

ingredients.forEach(ingredient => {
    ingredient.addEventListener('dragstart', dragStart);
    ingredient.addEventListener('dragend', dragEnd);
});

bentoSections.forEach(section => {
    section.addEventListener('dragover', dragOver);
    section.addEventListener('dragenter', dragEnter);
    section.addEventListener('dragleave', dragLeave);
    section.addEventListener('drop', drop);
});

let ingredientStack = {}; // Tracks ingredients in each section

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    setTimeout(() => event.target.classList.add('invisible'), 0);
}

function dragEnd(event) {
    event.target.classList.remove('invisible');
}

function dragOver(event) {
    event.preventDefault();
}

function dragEnter(event) {
    event.preventDefault();
    event.target.classList.add('hovered');
}

function dragLeave(event) {
    event.target.classList.remove('hovered');
}

function drop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text');
    const draggable = document.getElementById(id);

    // Create an item element with the emoji and delete button
    const itemContainer = document.createElement('div');
    itemContainer.classList.add('ingredient-added');

    // Add the ingredient emoji
    const emojiSpan = document.createElement('span');
    emojiSpan.innerHTML = draggable.innerHTML;
    emojiSpan.classList.add('grow'); // Scale effect
    itemContainer.appendChild(emojiSpan);

    // Add delete button for this ingredient
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = '❌';
    deleteBtn.onclick = () => removeItem(event.target, itemContainer);
    itemContainer.appendChild(deleteBtn);

    // Append to section and update stack tracking
    event.target.appendChild(itemContainer);
    event.target.classList.remove('hovered');

    if (!ingredientStack[event.target.id]) {
        ingredientStack[event.target.id] = [];
    }
    ingredientStack[event.target.id].push(itemContainer);
}

function removeItem(section, itemContainer) {
    // Remove the item from the section and update the stack
    itemContainer.remove();
    const sectionId = section.id;
    if (ingredientStack[sectionId]) {
        ingredientStack[sectionId] = ingredientStack[sectionId].filter(item => item !== itemContainer);
    }
}

createDishBtn.addEventListener('click', () => {
    // Remove the last-added item from each section's stack if available
    bentoSections.forEach(section => {
        const sectionId = section.id;
        if (ingredientStack[sectionId] && ingredientStack[sectionId].length > 0) {
            const lastItem = ingredientStack[sectionId].pop();
            lastItem.remove();
        }
    });
});
