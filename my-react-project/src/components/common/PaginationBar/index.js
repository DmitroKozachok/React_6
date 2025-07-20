const PaginationBar = ({ onPageChange, totalPages, currentPage }) => {
    if (totalPages <= 1) return null;

    const renderPageButton = (pageNum) => (
        <li key={pageNum} className={`page-item ${pageNum === currentPage ? "active" : ""}`}>
            <button className="page-link bg-success text-white" onClick={() => onPageChange(pageNum)}>
                {pageNum}
            </button>
        </li>
    );

    const renderEllipsis = (key) => (
        <li key={key} className="page-item disabled">
            <span className="page-link text-white">…</span>
        </li>
    );

    const getVisiblePages = () => {
        const pages = [];
        const delta = 1;

        const startPage = Math.max(2, currentPage - delta);
        const endPage = Math.min(totalPages - 1, currentPage + delta);

        pages.push(1);

        if (startPage > 2) {
            pages.push("...");
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages - 1) {
            pages.push("...");
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
                {/* Previous button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                        className="page-link text-seccess"
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        aria-label="Previous"
                    >
                        <span aria-hidden="true">&laquo;</span>
                    </button>
                </li>

                {getVisiblePages().map((page, index) => 
                    typeof page === 'number' 
                        ? renderPageButton(page)
                        : renderEllipsis(`ellipsis-${index}`)
                )}

                {/* Next button */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                        className="page-link text-seccess"
                        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                        aria-label="Next"
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default PaginationBar;
