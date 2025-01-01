import os

def list_files_and_folders(path, indent=0, output_file=None, included_folders=None):
    """
    Рекурсивно обходит папки и файлы, записывая их структуру в файл.
    :param path: Путь к текущей папке.
    :param indent: Уровень вложенности (для отступов).
    :param output_file: Файл для записи структуры.
    :param included_folders: Список папок, которые нужно включить в структуру.
    """
    try:
        # Получаем список элементов в текущей папке
        with os.scandir(path) as entries:
            for entry in entries:
                # Если это папка
                if entry.is_dir():
                    # Проверяем, нужно ли включать эту папку
                    if included_folders is None or entry.name in included_folders:
                        output_file.write(' ' * indent + f'{entry.name}/\n')
                        # Рекурсивно обходим содержимое папки
                        list_files_and_folders(entry.path, indent + 4, output_file, included_folders)
                # Если это файл
                elif entry.is_file():
                    output_file.write(' ' * indent + f'{entry.name}\n')
    except PermissionError:
        # Пропускаем папки, к которым нет доступа
        output_file.write(' ' * indent + '[Permission Denied]\n')

def create_project_structure(startpath, output_file, included_folders=None):
    """
    Создает структуру проекта и записывает её в файл.
    :param startpath: Путь к корневой папке проекта.
    :param output_file: Имя выходного файла.
    :param included_folders: Список папок, которые нужно включить в структуру.
    """
    with open(output_file, 'w', encoding='utf-8') as f:
        # Записываем корневую папку
        f.write(f'{os.path.basename(startpath)}/\n')
        # Рекурсивно обходим содержимое
        list_files_and_folders(startpath, 4, f, included_folders)

# Укажи путь к корневой папке проекта
project_path = r'C:\Users\danya\PycharmProjects\maxitapbotlatestversion'
# Укажи имя выходного файла
output_file = 'project_structure.txt'
# Укажи папки, которые нужно включить в структуру
included_folders = ['bot', 'src','Components','contex','firebase','hooks','pages',]  # Например, только папки 'src' и 'data'

# Создаем структуру
create_project_structure(project_path, output_file, included_folders)

print(f"Структура проекта сохранена в файл: {output_file}")