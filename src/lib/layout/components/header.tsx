export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Food Directory</h1>
            <p className="text-gray-600 mt-1">
              Discover amazing restaurants and culinary experiences
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
