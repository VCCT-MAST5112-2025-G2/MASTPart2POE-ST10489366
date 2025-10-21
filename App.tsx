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
  ImageBackground, // Add this import
  Image // Add this import for logo if needed
} from 'react-native';

// Define the type for our menu items
type MenuItem = {
  id: string;
  name: string;
  description: string;
  course: string;
  price: string;
};

// Predefined list of courses
const COURSES = ['Starter', 'Main', 'Dessert'];

export default function App() {
  // State management
  const [showHomeScreen, setShowHomeScreen] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
  // Form state
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [price, setPrice] = useState('');

  // Handle adding new menu item
  const handleAddMenuItem = () => {
    if (!dishName || !description || !selectedCourse || !price) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newItem: MenuItem = {
      id: Math.random().toString(36).substring(7),
      name: dishName,
      description: description,
      course: selectedCourse,
      price: price,
    };

    setMenuItems([...menuItems, newItem]);
    
    // Reset form
    setDishName('');
    setDescription('');
    setSelectedCourse('');
    setPrice('');
    
    // Close modal
    setIsAddModalVisible(false);
    
    Alert.alert('Success', 'Menu item added successfully!');
  };

  // Reset form when canceling
  const handleCancel = () => {
    setDishName('');
    setDescription('');
    setSelectedCourse('');
    setPrice('');
    setIsAddModalVisible(false);
  };

  // Welcome Screen
  if (!showHomeScreen) {
    return (
       <ImageBackground 
      source={require('./image/food.png')} // Path to your image
      style={styles.welcomeBackground}
      resizeMode="cover"
      >
      {/* Dark overlay for better text readability */}
      <View style={styles.overlay}>
        <View style={styles.welcomeContent}>
          {/* Optional: Add a logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>👨‍🍳</Text>
          </View>
          
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



  // Home Screen
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Christoffel's Menu</Text>
        <Text style={styles.subtitle}>Select a Course to View</Text>
      </View>

      {/* Course Filter Section */}
      <View style={styles.courseSection}>
        <Text style={styles.sectionTitle}>Course</Text>
        <View style={styles.courseButtons}>
          <TouchableOpacity style={styles.courseButton}>
            <Text style={styles.courseButtonText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseButton}>
            <Text style={styles.courseButtonText}>Starters</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseButton}>
            <Text style={styles.courseButtonText}>Main</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseButton}>
            <Text style={styles.courseButtonText}>Desserts</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Items List */}
      <View style={styles.listContainer}>
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.menuItem}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCourse}>{item.course}</Text>
              </View>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>R{item.price}</Text>
                <TouchableOpacity style={styles.editButton}>
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

      {/* Total Items Count */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Items: {menuItems.length}</Text>
      </View>

      {/* Add New Dish Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Text style={styles.addButtonText}>ADD NEW DISH</Text>
      </TouchableOpacity>

      {/* Add Dish Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Dish</Text>
            
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
                onPress={handleAddMenuItem}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Welcome Screen Styles
  welcomeBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContent: {
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    fontSize: 48,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6b6b',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
  },
  getStartedButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#e9ecef',
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
    justifyContent: 'space-between',
  },
  courseButton: {
    backgroundColor: '#e9ecef',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff6b6b',
  }, 
  courseButtonText: {
    color: '#333',
    fontWeight: '500',
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

  // Total Container
  totalContainer: {
    backgroundColor: 'white',
    padding: 20,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
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
    height: 80,
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
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // Button Text (shared)
  buttonText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
  },
});