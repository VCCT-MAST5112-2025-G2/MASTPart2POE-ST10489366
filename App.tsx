import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
  ScrollView
} from 'react-native';

// Define types
type CourseType = 'Starter' | 'Main' | 'Dessert';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: CourseType;
  price: number;
}

// Global variables
const COURSES: CourseType[] = ['Starter', 'Main', 'Dessert'];

// Utility functions with loops
const calculateAveragePrice = (items: MenuItem[], course: CourseType): number => {
  let total = 0;
  let count = 0;
  
  // Using for loop
  for (let i = 0; i < items.length; i++) {
    if (items[i].course === course) {
      total += items[i].price;
      count++;
    }
  }
  
  return count > 0 ? Number((total / count).toFixed(2)) : 0;
};

const filterItemsByCourse = (items: MenuItem[], course: CourseType): MenuItem[] => {
  const filtered: MenuItem[] = [];
  let i = 0;
  
  // Using while loop
  while (i < items.length) {
    if (items[i].course === course) {
      filtered.push(items[i]);
    }
    i++;
  }
  
  return filtered;
};

export default function App() {
  // State management
  const [showHomeScreen, setShowHomeScreen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'add' | 'edit' | 'filter'>('home');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<CourseType | 'All'>('All');
  
  // Form state
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CourseType>('Main');
  const [price, setPrice] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Generate unique ID
  const generateId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  // Handle adding new menu item
  const handleAddMenuItem = () => {
    if (!dishName || !description || !price) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    const newItem: MenuItem = {
      id: generateId(),
      name: dishName,
      description: description,
      course: selectedCourse,
      price: priceValue,
    };

    setMenuItems([...menuItems, newItem]);
    resetForm();
    setCurrentScreen('home');
    Alert.alert('Success', 'Menu item added successfully!');
  };

  // Handle editing menu item
  const handleEditMenuItem = () => {
    if (!editingItem || !dishName || !description || !price) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    const updatedItem: MenuItem = {
      ...editingItem,
      name: dishName,
      description: description,
      course: selectedCourse,
      price: priceValue,
    };

    setMenuItems(menuItems.map(item => 
      item.id === editingItem.id ? updatedItem : item
    ));
    
    resetForm();
    setCurrentScreen('home');
    Alert.alert('Success', 'Menu item updated successfully!');
  };

  // Handle delete menu item
  const handleDeleteMenuItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this menu item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            setMenuItems(menuItems.filter(item => item.id !== itemId));
            Alert.alert('Success', 'Menu item deleted successfully!');
          }
        }
      ]
    );
  };

  // Reset form
  const resetForm = () => {
    setDishName('');
    setDescription('');
    setSelectedCourse('Main');
    setPrice('');
    setEditingItem(null);
  };

  // Start editing an item
  const startEditing = (item: MenuItem) => {
    setDishName(item.name);
    setDescription(item.description);
    setSelectedCourse(item.course);
    setPrice(item.price.toString());
    setEditingItem(item);
    setCurrentScreen('edit');
  };

  // Cancel editing/adding
  const handleCancel = () => {
    resetForm();
    setCurrentScreen('home');
  };

  // Filtered items based on active filter
  const filteredItems = activeFilter === 'All' 
    ? menuItems 
    : filterItemsByCourse(menuItems, activeFilter);

  // Welcome Screen
  if (!showHomeScreen) {
    return (
      <ImageBackground 
        source={require('./assets/food.png')}
        style={styles.welcomeBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.welcomeContent}>
            <Text style={styles.logo}>👨‍🍳</Text>
            <Text style={styles.welcomeTitle}>Christoffel's Food App!</Text>
            <Text style={styles.welcomeSubtitle}>Private Culinary Experiences</Text>
            <TouchableOpacity 
              style={styles.getStartedButton} 
              onPress={() => setShowHomeScreen(true)}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  // Filter Screen
  if (currentScreen === 'filter') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter Menu</Text>
          <Text style={styles.subtitle}>Select A Course To View</Text>
        </View>

        <ScrollView style={styles.filterOptions}>
          <TouchableOpacity
            style={[styles.filterOption, activeFilter === 'All' && styles.activeFilterOption]}
            onPress={() => setActiveFilter('All')}
          >
            <Text style={[styles.filterOptionText, activeFilter === 'All' && styles.activeFilterOptionText]}>
              All
            </Text>
          </TouchableOpacity>

          {COURSES.map((course) => (
            <TouchableOpacity
              key={course}
              style={[styles.filterOption, activeFilter === course && styles.activeFilterOption]}
              onPress={() => setActiveFilter(course)}
            >
              <Text style={[styles.filterOptionText, activeFilter === course && styles.activeFilterOptionText]}>
                {course}s
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.applyButton} 
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.applyButtonText}>Apply Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Add/Edit Screen
  if (currentScreen === 'add' || currentScreen === 'edit') {
    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentScreen === 'add' ? 'Add New Dish' : 'Edit Dish'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Dish Name"
              value={dishName}
              onChangeText={setDishName}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={3}
            />
            
            <Text style={styles.inputLabel}>Course:</Text>
            <View style={styles.courseOptions}>
              {COURSES.map((course) => (
                <TouchableOpacity
                  key={course}
                  style={[
                    styles.courseOption,
                    selectedCourse === course && styles.selectedCourseOption
                  ]}
                  onPress={() => setSelectedCourse(course)}
                >
                  <Text style={[
                    styles.courseOptionText,
                    selectedCourse === course && styles.selectedCourseOptionText
                  ]}>
                    {course}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={currentScreen === 'add' ? handleAddMenuItem : handleEditMenuItem}
              >
                <Text style={styles.saveButtonText}>
                  {currentScreen === 'add' ? 'Save' : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>

            {currentScreen === 'edit' && (
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={() => editingItem && handleDeleteMenuItem(editingItem.id)}
              >
                <Text style={styles.deleteButtonText}>Delete Dish</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Home Screen (default)
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Christoffel's Menu</Text>
        <Text style={styles.subtitle}>Burger, Pizza, Cake......</Text>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setCurrentScreen('filter')}
        >
          <Text style={styles.filterButtonText}>Advanced Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Course Filter Section */}
      <View style={styles.courseSection}>
        <Text style={styles.sectionTitle}>Course</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.courseButtons}>
            <TouchableOpacity 
              style={[styles.courseButton, activeFilter === 'All' && styles.activeCourseButton]}
              onPress={() => setActiveFilter('All')}
            >
              <Text style={[styles.courseButtonText, activeFilter === 'All' && styles.activeCourseButtonText]}>
                All
              </Text>
            </TouchableOpacity>
            {COURSES.map((course) => (
              <TouchableOpacity 
                key={course}
                style={[styles.courseButton, activeFilter === course && styles.activeCourseButton]}
                onPress={() => setActiveFilter(course)}
              >
                <Text style={[styles.courseButtonText, activeFilter === course && styles.activeCourseButtonText]}>
                  {course}s
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Menu Items List */}
      <View style={styles.listContainer}>
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.menuItem}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCourse}>{item.course}</Text>
              </View>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => startEditing(item)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No menu items yet!</Text>
              <Text style={styles.emptyStateSubtext}>Add your first dish to get started.</Text>
            </View>
          }
        />
      </View>

      {/* Average Price Display */}
      <View style={styles.averageContainer}>
        <Text style={styles.averageTitle}>Average Prices by Course</Text>
        {COURSES.map((course) => {
          const average = calculateAveragePrice(menuItems, course);
          return (
            <View key={course} style={styles.averageRow}>
              <Text style={styles.averageCourse}>{course}:</Text>
              <Text style={styles.averagePrice}>R{average.toFixed(2)}</Text>
            </View>
          );
        })}
      </View>

      {/* Total Items Count */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Items: {filteredItems.length}</Text>
      </View>

      {/* Add New Dish Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setCurrentScreen('add');
        }}
      >
        <Text style={styles.addButtonText}>ADD NEW DISH</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Welcome Screen Styles
  welcomeBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContent: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  getStartedButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#e9ecef',
  },
  scrollView: {
    flex: 1,
  },

  // Header Styles
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  filterButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // Course Section
  courseSection: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  courseButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  courseButton: {
    backgroundColor: '#e9ecef',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  activeCourseButton: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  courseButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  activeCourseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // List Container
  listContainer: {
    flex: 1,
    padding: 20,
  },

  // Menu Item Styles
  menuItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemCourse: {
    backgroundColor: '#ff6b6b',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemDescription: {
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },

  // Average Price Display
  averageContainer: {
    backgroundColor: 'white',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  averageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  averageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  averageCourse: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  averagePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },

  // Total Container
  totalContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },

  // Add Button
  addButton: {
    backgroundColor: '#ff6b6b',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Modal Styles
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    marginTop: 60,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Input Styles
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },

  // Course Options
  courseOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  courseOption: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  selectedCourseOption: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  courseOptionText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedCourseOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // Modal Buttons
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#ff6b6b',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    marginHorizontal: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // Filter Screen Styles
  filterOptions: {
    flex: 1,
    padding: 20,
  },
  filterOption: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeFilterOption: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  filterOptionText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeFilterOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  applyButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 10,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Button Text (shared)
  buttonText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
  },
});