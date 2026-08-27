CREATE TABLE IF NOT EXISTS _article_to_article_category (
    "A" VARCHAR(36) NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    "B" VARCHAR(36) NOT NULL REFERENCES article_categories(id) ON DELETE CASCADE,
    PRIMARY KEY ("A", "B")
);

CREATE INDEX IF NOT EXISTS idx_article_category_join_b ON _article_to_article_category("B");

