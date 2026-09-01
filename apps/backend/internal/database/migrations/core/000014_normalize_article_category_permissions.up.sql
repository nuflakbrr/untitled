UPDATE permissions SET name = replace(name, 'article_categories.', 'article.categories.')
WHERE name LIKE 'article_categories.%';
