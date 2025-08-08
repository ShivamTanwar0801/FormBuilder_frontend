import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function CategorizePreview({ question, onChange }) {
  const categories = question.categories || [];

  // Normalize options: ensure each has unique id and url
  const normalizeOptions = (opts) =>
    (opts || []).map((opt, idx) =>
      typeof opt === "string" ? { id: `opt-${idx}`, url: opt } : opt
    );

  const [local, setLocal] = useState({
    unassigned: normalizeOptions(question.options),
    ...Object.fromEntries(categories.map((cat) => [cat, []])),
  });

  // Sync with parent changes
  useEffect(() => {
    setLocal({
      unassigned: normalizeOptions(question.options),
      ...Object.fromEntries(categories.map((cat) => [cat, []])),
    });
  }, [question.options, categories]);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceList = [...local[source.droppableId]];
    const destList = [...local[destination.droppableId]];
    const [moved] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, moved);

    const updated = { ...local, [source.droppableId]: sourceList, [destination.droppableId]: destList };
    setLocal(updated);
    onChange(updated);
  };

  const colorClasses = {
    gray: "border-gray-300 bg-gray-100",
    green: "border-green-400 bg-green-50",
  };

  const renderColumn = (droppableId, items, title, color) => (
    <Droppable key={droppableId} droppableId={droppableId}>
      {(provided) => (
        <div
          className={`flex flex-col p-5 border-2 border-dashed rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ${colorClasses[color]}`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h3 className="font-semibold text-lg mb-4 text-gray-700">{title}</h3>
          <div className="flex flex-wrap gap-3 min-h-[120px]">
            {items.length === 0 && (
              <p className="text-gray-400 italic select-none">Drag items here</p>
            )}
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white rounded-lg shadow p-2 cursor-grab transition-transform duration-200 
                      ${snapshot.isDragging ? "scale-105 shadow-lg" : ""}
                    `}
                    style={{ userSelect: "none", ...provided.draggableProps.style }}
                  >
                    <img
                      src={item.url}
                      alt=""
                      className="w-28 h-28 object-cover rounded-lg border border-gray-200"
                      draggable={false}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );

  return (
    <div>
      {question.questionImage && (
        <img
          src={question.questionImage}
          alt="categorize"
          className="w-full max-w-md mx-auto mb-6 rounded-lg shadow-md object-cover"
        />
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: `repeat(${categories.length + 1}, minmax(0, 1fr))` }}
        >
          {renderColumn("unassigned", local.unassigned, "Unassigned", "gray")}
          {categories.map((cat) => renderColumn(cat, local[cat], cat, "green"))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default CategorizePreview;
